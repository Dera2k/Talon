import { UserResponseDto } from '@users/dto/user-response.dto';
import { AuthSession } from '../interfaces/auth-session.interface';

export class AuthResponseDto {
  accessToken!: string;
  refreshToken?: string;
  user!: UserResponseDto;

  static from(
    session: AuthSession,
    includeRefreshToken: boolean,
  ): AuthResponseDto {
    return {
      accessToken: session.accessToken,
      ...(includeRefreshToken && { refreshToken: session.refreshToken }),
      user: UserResponseDto.from(session.user),
    };
  }
}
