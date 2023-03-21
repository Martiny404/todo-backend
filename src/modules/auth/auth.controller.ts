import { Body, Controller, Post, Req, Res, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AppClientRequest } from 'src/common/types/client-request.interface';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { clearCookies, setCookies } from '../../common/utils/cookies';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @Post('/registration')
  async registration(@Body() dto: RegisterDto) {
    return this.authService.registration(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(dto);
    setCookies(
      res,
      {
        refreshToken: data.refreshToken,
        accessToken: data.accessToken,
      },
      this.configService,
    );
    return res.status(200).json(data);
  }

  @Post('logout')
  async logout(@Res() res: Response, @Req() req: AppClientRequest) {
    const token = req.cookies.refreshToken as string;
    const result = await this.authService.logout(token);
    clearCookies(res);
    res.status(200).json(result);
  }
}
