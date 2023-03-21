import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { Folder } from './entities/folder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FolderController],
  providers: [FolderService],
  imports: [TypeOrmModule.forFeature([Folder])],
})
export class FolderModule {}
