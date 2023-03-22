import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { FolderModule } from '../folder/folder.module';

@Module({
  controllers: [NoteController],
  providers: [NoteService],
  imports: [TypeOrmModule.forFeature([Note]), FolderModule],
})
export class NoteModule {}
