import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GetJwtConfig } from 'src/config/jwt.config';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: GetJwtConfig,
    }),
    TypeOrmModule.forFeature([Token]),
    PassportModule,
    UserModule,
    ConfigModule,
  ],
  exports: [TokenService],
})
export class TokenModule {}
