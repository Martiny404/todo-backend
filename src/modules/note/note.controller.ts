import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppClientRequest } from 'src/common/types/client-request.interface';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { AuthorizationGuard } from '../token/guards/authorization.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { RemoveNotesDto } from './dto/remove-notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteService } from './note.service';

@UseFilters(HttpExceptionFilter)
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AuthorizationGuard)
  @Post('/create')
  create(@Body() dto: CreateNoteDto, @Req() req: AppClientRequest) {
    const userId = req.user.id;
    return this.noteService.create(dto, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Patch('/toggle/:id')
  toggleCompleted(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: AppClientRequest,
  ) {
    const userId = req.user.id;
    return this.noteService.toggleCompleted(id, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Patch('/update/:id')
  updateNote(
    @Body() dto: UpdateNoteDto,
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: AppClientRequest,
  ) {
    const userId = req.user.id;
    return this.noteService.update(dto, id, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Delete('/re,ove')
  removeNotes(@Body() dto: RemoveNotesDto, @Req() req: AppClientRequest) {
    const userId = req.user.id;
    return this.noteService.removeNotes(dto.ids, userId);
  }
}
