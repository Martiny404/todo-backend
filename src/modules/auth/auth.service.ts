import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { compare, hash } from 'bcryptjs';
import { AuthResponse } from 'src/common/classes/auth-response.class';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';
import {
  BAD_CREDENTIALS,
  EMAIL_IS_EXIST,
} from 'src/common/constants/error-messages/auth.errors';
import { USER_NOT_FOUND } from 'src/common/constants/error-messages/user.errors';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async registration(dto: RegisterDto): Promise<number> {
    const isEmailExist = await this.userService.findUser({
      where: { email: dto.email },
    });
    if (isEmailExist) {
      throw new BadRequestException(EMAIL_IS_EXIST);
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await this.userService.createUser({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    await this.userService.saveUser(user);

    return user.id;
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const user = await this.userService.findUser({ where: { email } });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException(BAD_CREDENTIALS);
    }
    const payload = new JwtPayload(user);
    const { refreshToken, accessToken } =
      await this.tokenService.generateTokens(payload);

    await this.tokenService.saveToken(user.id, refreshToken);

    return new AuthResponse(payload, accessToken, refreshToken);
  }

  async logout(refreshToken: string): Promise<boolean> {
    await this.tokenService.removeToken(refreshToken);
    return true;
  }
}
