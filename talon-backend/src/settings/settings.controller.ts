import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import {
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
} from '@common/constants/jwt.constants';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { SettingsResponseDto } from './dto/settings-response.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

const SENSITIVE_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  async get(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SettingsResponseDto> {
    return SettingsResponseDto.from(await this.settings.getSettings(user.id));
  }

  @Patch()
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSettingsDto,
  ): Promise<SettingsResponseDto> {
    return SettingsResponseDto.from(
      await this.settings.updateSettings(user.id, dto),
    );
  }

  @Throttle(SENSITIVE_THROTTLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.settings.changePassword(user.id, dto);
    this.clearRefreshCookie(res);
  }

  @Throttle(SENSITIVE_THROTTLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('account')
  async deleteAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: DeleteAccountDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.settings.deleteAccount(user.id, dto.password);
    this.clearRefreshCookie(res);
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  }
}
