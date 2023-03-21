import { Controller, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { NoteService } from './note.service';

@UseFilters(HttpExceptionFilter)
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}
}
