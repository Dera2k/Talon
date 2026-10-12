import { Theme } from '../../common/enums/theme.enum';

export class AuthUserDto {
  id!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  timezone!: string;
  theme!: Theme;
}
