import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import {
  MOBILE_CLIENT_HEADER,
  MOBILE_CLIENT_VALUE,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
} from '@common/constants/jwt.constants';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthSession } from './interfaces/auth-session.interface';

const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const isMobileClient = (req: Request): boolean =>
  req.header(MOBILE_CLIENT_HEADER) === MOBILE_CLIENT_VALUE;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.toResponse(await this.authService.register(dto), req, res);
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.toResponse(await this.authService.login(dto), req, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const token = this.extractRefreshToken(req, dto);
    if (!token) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
        'Refresh token missing',
      );
    }
    return this.toResponse(await this.authService.refresh(token), req, res);
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = this.extractRefreshToken(req, dto);
    if (token) await this.authService.logout(token);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout-all')
  async logoutAll(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logoutAll(user.id);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto);
  }

  private extractRefreshToken(
    req: Request,
    dto: RefreshTokenDto,
  ): string | undefined {
    return isMobileClient(req)
      ? dto.refreshToken
      : (req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined);
  }

  private toResponse(
    session: AuthSession,
    req: Request,
    res: Response,
  ): AuthResponseDto {
    const isMobile = isMobileClient(req);
    if (!isMobile) {
      res.cookie(REFRESH_COOKIE_NAME, session.refreshToken, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: 'lax',
        path: REFRESH_COOKIE_PATH,
        expires: session.refreshExpiresAt,
      });
    }
    return AuthResponseDto.from(session, isMobile);
  }
}
