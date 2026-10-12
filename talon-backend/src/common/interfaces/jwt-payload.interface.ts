import { TokenType } from '@common/enums/token-type.enum';

export interface JwtPayload {
  sub: string;
  type: TokenType;
  iat?: number;
  exp?: number;
}
