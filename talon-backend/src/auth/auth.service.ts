import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import { DataSource, IsNull, MoreThan, Repository } from 'typeorm';
import {
  PASSWORD_RESET_TTL_MS,
  REFRESH_REUSE_GRACE_MS,
} from '@common/constants/jwt.constants';
import { ErrorCode } from '@common/enums/error-code.enum';
import { TokenType } from '@common/enums/token-type.enum';
import { AppException } from '@common/exceptions/app.exception';
import { JwtPayload } from '@common/interfaces/jwt-payload.interface';
import { generateToken, hashToken } from '@common/utils/crypto.util';
import { durationToMs } from '@common/utils/duration.util';
import { MailService } from '../mail/mail.service';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthSession } from './interfaces/auth-session.interface';

@Injectable()
export class AuthService {
  private readonly refreshTtlMs: number;
  private readonly resetPasswordUrl: string;
  private readonly dummyHash = argon2.hash(randomUUID());

  constructor(
    private readonly users: UsersService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
    private readonly dataSource: DataSource,
    config: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
    @InjectRepository(PasswordResetToken)
    private readonly resetTokens: Repository<PasswordResetToken>,
  ) {
    this.refreshTtlMs = durationToMs(
      config.getOrThrow<string>('jwt.refreshExpiresIn'),
    );
    this.resetPasswordUrl = config.getOrThrow<string>('mail.resetPasswordUrl');
  }

  async register(dto: RegisterDto): Promise<AuthSession> {
    const user = await this.users.create({
      email: dto.email,
      passwordHash: await argon2.hash(dto.password),
      firstName: dto.firstName,
      lastName: dto.lastName,
      timezone: dto.timezone,
    });
    return this.issueSession(user);
  }

  async login(dto: LoginDto): Promise<AuthSession> {
    const user = await this.users.findByEmailWithPassword(dto.email);
    const isValid = await argon2.verify(
      user?.passwordHash ?? (await this.dummyHash),
      dto.password,
    );

    if (!user || !isValid) {
      throw this.unauthorized('Invalid credentials');
    }
    return this.issueSession(user);
  }

  async refresh(rawToken: string): Promise<AuthSession> {
    const stored = await this.refreshTokens.findOneBy({
      tokenHash: hashToken(rawToken),
    });
    if (!stored) throw this.unauthorized('Invalid refresh token');

    if (stored.revokedAt) {
      const isRecentRotation =
        Date.now() - stored.revokedAt.getTime() < REFRESH_REUSE_GRACE_MS;
      if (!isRecentRotation) await this.revokeFamily(stored.familyId);
      throw this.unauthorized('Invalid refresh token');
    }
    if (stored.expiresAt <= new Date()) {
      throw this.unauthorized('Invalid refresh token');
    }

    const claimed = await this.refreshTokens.update(
      { id: stored.id, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
    if (!claimed.affected) throw this.unauthorized('Invalid refresh token');

    const user = await this.users.findById(stored.userId);
    if (!user) throw this.unauthorized('Invalid refresh token');

    return this.issueSession(user, stored.familyId);
  }

  async logout(rawToken: string): Promise<void> {
    await this.refreshTokens.update(
      { tokenHash: hashToken(rawToken), revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokens.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) return;

    const token = generateToken();
    await this.resetTokens.save(
      this.resetTokens.create({
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
        usedAt: null,
      }),
    );
    await this.mail.sendPasswordReset(
      user.email,
      `${this.resetPasswordUrl}?token=${token}`,
    );
  }

  async resetPassword({ token, newPassword }: ResetPasswordDto): Promise<void> {
    const tokenHash = hashToken(token);
    const passwordHash = await argon2.hash(newPassword);

    await this.dataSource.transaction(async (manager) => {
      const claimed = await manager.update(
        PasswordResetToken,
        { tokenHash, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
        { usedAt: new Date() },
      );
      if (!claimed.affected) {
        throw new AppException(
          HttpStatus.BAD_REQUEST,
          ErrorCode.BUSINESS_LOGIC_ERROR,
          'Reset token is invalid or expired',
        );
      }

      const record = await manager.findOneByOrFail(PasswordResetToken, {
        tokenHash,
      });
      await manager.update(User, record.userId, { passwordHash });
      await manager.update(
        RefreshToken,
        { userId: record.userId, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );
    });
  }

  private async issueSession(
    user: User,
    familyId: string = randomUUID(),
  ): Promise<AuthSession> {
    const payload: JwtPayload = { sub: user.id, type: TokenType.ACCESS };
    const refreshToken = generateToken();
    const refreshExpiresAt = new Date(Date.now() + this.refreshTtlMs);

    await this.refreshTokens.save(
      this.refreshTokens.create({
        userId: user.id,
        familyId,
        tokenHash: hashToken(refreshToken),
        expiresAt: refreshExpiresAt,
        revokedAt: null,
      }),
    );

    return {
      accessToken: this.jwt.sign(payload),
      refreshToken,
      refreshExpiresAt,
      user,
    };
  }

  private revokeFamily(familyId: string) {
    return this.refreshTokens.update(
      { familyId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  private unauthorized(message: string): AppException {
    return new AppException(
      HttpStatus.UNAUTHORIZED,
      ErrorCode.UNAUTHORIZED,
      message,
    );
  }
}
