import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FOLDER_NOT_FOUND } from 'src/common/constants/error-messages/folder.errors';
import {
  NOTE_NOT_FOUND,
  NOTE_TITLE_EXIST,
} from 'src/common/constants/error-messages/note.errors';
import { Repository, SaveOptions } from 'typeorm';
import { FolderService } from '../folder/folder.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    private readonly fodlerService: FolderService,
  ) {}

  async create(dto: CreateNoteDto, userId: number): Promise<Note> {
    const folder = await this.fodlerService.findFolder({
      where: { id: dto.folderId },
    });
    if (!folder) {
      throw new NotFoundException(FOLDER_NOT_FOUND);
    }
    const existTitle = await this.checkNoteTitle(folder.id, dto.title);

    if (existTitle) {
      throw new BadRequestException(NOTE_TITLE_EXIST);
    }

    const note = this.noteRepository.create({
      title: dto.title,
      description: dto.description,
      filePath: dto.filePath,
      folder: { id: folder.id },
      user: { id: userId },
    });
    return this.saveNote(note);
  }

  async checkNoteTitle(folderId: number, title: string): Promise<Note> {
    const notes = await this.noteRepository.find({
      where: { folder: { id: folderId } },
    });

    const exist = notes.find((note) => note.title === title);
    return exist;
  }

  async saveNote(entity: Note, options?: SaveOptions): Promise<Note> {
    return await this.noteRepository.save(entity, options);
  }

  async toggleCompleted(id: number, userId: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!note) {
      throw new NotFoundException(NOTE_NOT_FOUND);
    }
    note.isCompleted = !note.isCompleted;
    return this.saveNote(note);
  }
}
