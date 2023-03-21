import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GetTypeormConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { RoleModule } from './modules/role/role.module';
import { FolderModule } from './modules/folder/folder.module';
import { NoteModule } from './modules/note/note.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: GetTypeormConfig,
    }),
    UserModule,
    AuthModule,
    TokenModule,
    RoleModule,
    FolderModule,
    NoteModule,
    FileUploadModule,
  ],
})
export class AppModule {}
