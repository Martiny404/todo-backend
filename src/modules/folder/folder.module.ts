import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { Folder } from './entities/folder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [FolderController],
  providers: [FolderService],
  imports: [TypeOrmModule.forFeature([Folder]), UserModule],
})
export class FolderModule {}
