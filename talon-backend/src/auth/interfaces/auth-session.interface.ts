import { User } from '@users/entities/user.entity';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
  user: User;
}
