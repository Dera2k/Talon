import { AuthUserDto } from './user-response.dto';
import { AuthSession } from '../interfaces/auth-session.interface';

export class AuthResponseDto {
  accessToken!: string;
  refreshToken?: string;
  user!: AuthUserDto;

  static from(
    session: AuthSession,
    includeRefreshToken: boolean,
  ): AuthResponseDto {
    const { user } = session;
    return {
      accessToken: session.accessToken,
      ...(includeRefreshToken && { refreshToken: session.refreshToken }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        timezone: user.timezone,
        theme: user.theme,
      },
    };
  }
}
