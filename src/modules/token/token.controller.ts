import { Controller, Post, Req, Res, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { setCookies } from 'src/common/utils/cookies.util';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { TokenService } from './token.service';

@UseFilters(HttpExceptionFilter)
@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const refreshToken = req.cookies.refreshToken as string;
    const data = await this.tokenService.refresh(refreshToken);
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
}
