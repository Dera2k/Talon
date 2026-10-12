import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenType } from '@common/enums/token-type.enum';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { JwtPayload } from '@common/interfaces/jwt-payload.interface';
import { UsersService } from '@users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (payload.type !== TokenType.ACCESS) throw new UnauthorizedException();

    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      timezone: user.timezone,
      theme: user.theme,
    };
  }
}
