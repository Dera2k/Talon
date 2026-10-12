import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { JWT_CONSTANTS } from '@common/constants/jwt.constants';

@Injectable()
export class TokenService {
  generateRefreshToken(): string {
    return crypto
      .randomBytes(JWT_CONSTANTS.REFRESH_TOKEN_BYTES)
      .toString('hex');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  getRefreshTokenExpiry(): Date {
    const ms = this.parseExpiry(JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY);
    return new Date(Date.now() + ms);
  }

  getResetTokenExpiry(): Date {
    return new Date(Date.now() + JWT_CONSTANTS.RESET_TOKEN_EXPIRY_MS);
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 30 * 24 * 60 * 60 * 1000;
    }
  }
}
