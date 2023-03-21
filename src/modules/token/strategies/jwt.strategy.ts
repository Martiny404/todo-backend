import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';
import { UNAUTHORIZED_MESSAGE } from 'src/common/constants/error-messages/token.errors';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_ACCESS'),
    });
  }

  async validate({ id }: Pick<JwtPayload, 'id'>): Promise<User> {
    const user = await this.userService.findUser({ where: { id } });
    if (!user) {
      throw new UnauthorizedException(UNAUTHORIZED_MESSAGE);
    }
    return user;
  }
}
