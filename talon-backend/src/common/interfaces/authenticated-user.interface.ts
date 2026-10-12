import { Role } from '@common/enums/role.enum';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  timezone: string;
  theme: string;
}
