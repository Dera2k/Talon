import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { DataSource } from 'typeorm';
import { ErrorCode } from '@common/enums/error-code.enum';
import { hashToken } from '@common/utils/crypto.util';
import { MailService } from '../mail/mail.service';
import { UsersService } from '@users/users.service';
import { AuthService } from './auth.service';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';

jest.mock('argon2');

const hash = argon2.hash as jest.Mock;
const verify = argon2.verify as jest.Mock;

const user = { id: 'u1', email: 'a@b.com', passwordHash: 'stored-hash' };

describe('AuthService', () => {
  let service: AuthService;
  const users = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
  };
  const refreshRepo = {
    create: jest.fn((value: unknown) => value),
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    hash.mockResolvedValue('new-hash');
    verify.mockResolvedValue(true);
    refreshRepo.update.mockResolvedValue({ affected: 1 });

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: users },
        { provide: MailService, useValue: { sendPasswordReset: jest.fn() } },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('access-token') },
        },
        { provide: DataSource, useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) =>
              ({
                'jwt.refreshExpiresIn': '7d',
                'mail.resetPasswordUrl': 'http://x/reset',
              })[key],
          },
        },
        { provide: getRepositoryToken(RefreshToken), useValue: refreshRepo },
        {
          provide: getRepositoryToken(PasswordResetToken),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('login', () => {
    it('rejects an unknown email but still performs a hash verification', async () => {
      users.findByEmailWithPassword.mockResolvedValue(null);
      verify.mockResolvedValue(false);

      await expect(
        service.login({ email: 'x@y.com', password: 'pw' }),
      ).rejects.toMatchObject({
        code: ErrorCode.UNAUTHORIZED,
      });
      expect(verify).toHaveBeenCalledTimes(1);
    });

    it('rejects a wrong password', async () => {
      users.findByEmailWithPassword.mockResolvedValue(user);
      verify.mockResolvedValue(false);

      await expect(
        service.login({ email: user.email, password: 'bad' }),
      ).rejects.toMatchObject({
        code: ErrorCode.UNAUTHORIZED,
      });
    });

    it('issues a session and stores only the refresh token hash', async () => {
      users.findByEmailWithPassword.mockResolvedValue(user);

      const session = await service.login({
        email: user.email,
        password: 'pw',
      });

      expect(session.accessToken).toBe('access-token');
      expect(refreshRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'u1',
          tokenHash: hashToken(session.refreshToken),
        }),
      );
    });
  });

  describe('refresh', () => {
    const stored = {
      id: 't1',
      userId: 'u1',
      familyId: 'f1',
      revokedAt: null as Date | null,
      expiresAt: new Date(Date.now() + 60_000),
    };

    beforeEach(() => users.findById.mockResolvedValue(user));

    it('rejects an unknown token', async () => {
      refreshRepo.findOneBy.mockResolvedValue(null);
      await expect(service.refresh('raw')).rejects.toMatchObject({
        code: ErrorCode.UNAUTHORIZED,
      });
    });

    it('rotates a valid token inside the same family', async () => {
      refreshRepo.findOneBy.mockResolvedValue({ ...stored });

      await service.refresh('raw');

      expect(refreshRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: 't1' }),
        { revokedAt: expect.any(Date) as Date },
      );
      expect(refreshRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ familyId: 'f1' }),
      );
    });

    it('revokes the whole family when a rotated token is replayed after the grace window', async () => {
      refreshRepo.findOneBy.mockResolvedValue({
        ...stored,
        revokedAt: new Date(Date.now() - 60_000),
      });

      await expect(service.refresh('raw')).rejects.toMatchObject({
        code: ErrorCode.UNAUTHORIZED,
      });
      expect(refreshRepo.update).toHaveBeenCalledWith(
        expect.objectContaining({ familyId: 'f1' }),
        { revokedAt: expect.any(Date) as Date },
      );
    });

    it('rejects without revoking the family inside the grace window', async () => {
      refreshRepo.findOneBy.mockResolvedValue({
        ...stored,
        revokedAt: new Date(),
      });

      await expect(service.refresh('raw')).rejects.toMatchObject({
        code: ErrorCode.UNAUTHORIZED,
      });
      expect(refreshRepo.update).not.toHaveBeenCalled();
    });

    it('rejects an expired token', async () => {
      refreshRepo.findOneBy.mockResolvedValue({
        ...stored,
        expiresAt: new Date(Date.now() - 1),
      });
      await expect(service.refresh('raw')).rejects.toMatchObject({
        code: ErrorCode.UNAUTHORIZED,
      });
    });

    it('rejects when a concurrent request already claimed the token', async () => {
      refreshRepo.findOneBy.mockResolvedValue({ ...stored });
      refreshRepo.update.mockResolvedValue({ affected: 0 });
      await expect(service.refresh('raw')).rejects.toMatchObject({
        code: ErrorCode.UNAUTHORIZED,
      });
    });

    it('rejects when the user was deleted', async () => {
      refreshRepo.findOneBy.mockResolvedValue({ ...stored });
      users.findById.mockResolvedValue(null);
      await expect(service.refresh('raw')).rejects.toMatchObject({
        code: ErrorCode.UNAUTHORIZED,
      });
    });
  });

  it('logout revokes by token hash, never the raw value', async () => {
    await service.logout('raw');
    expect(refreshRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({ tokenHash: hashToken('raw') }),
      { revokedAt: expect.any(Date) as Date },
    );
  });
});
