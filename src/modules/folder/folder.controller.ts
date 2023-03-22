import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppClientRequest } from 'src/common/types/client-request.interface';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { AuthorizationGuard } from '../token/guards/authorization.guard';
import { CreateFolderDto } from './dto/create-folder.dto';
import { GetAllFoldersDto } from './dto/get-all.dto';
import { GetOneFolderDto } from './dto/get-one.dto';
import { RemoveFoldersDto } from './dto/remove-folders.dto';
import { FolderService } from './folder.service';

@UseFilters(HttpExceptionFilter)
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(AuthorizationGuard)
  @Get('/all')
  getAll(@Query() query: GetAllFoldersDto, @Req() req: AppClientRequest) {
    const userId = req.user.id;
    return this.folderService.getAll(query, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Get('/:id')
  getOne(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: AppClientRequest,
    @Query() query: GetOneFolderDto,
  ) {
    const userId = req.user.id;

    return this.folderService.getOne(query, id, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Post('/create')
  create(@Body() dto: CreateFolderDto, @Req() req: AppClientRequest) {
    const userId = req.user.id;
    return this.folderService.create(dto, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Delete('/remove')
  remove(@Body() dto: RemoveFoldersDto, @Req() req: AppClientRequest) {
    const userId = req.user.id;
    return this.folderService.removeFolders(dto.ids, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Patch('/change-name/:id')
  changeName(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: CreateFolderDto,
    @Req() req: AppClientRequest,
  ) {
    const userId = req.user.id;
    return this.folderService.changeName(id, dto.name, userId);
  }
}
