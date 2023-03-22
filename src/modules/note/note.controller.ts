import {
  Body,
  Controller,
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
}
