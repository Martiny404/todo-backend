import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export async function GetTypeormConfig(
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> {
  return {
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    database: configService.get('DATABASE_NAME'),
    username: configService.get('DATABASE_LOGIN'),
    password: configService.get('DATABASE_PASSWORD'),
    autoLoadEntities: true,
    synchronize: true,
    entities: [join(process.cwd(), 'dist', '**', '*.entity{.ts,.js}')],
    //logging: true,
  };
}
