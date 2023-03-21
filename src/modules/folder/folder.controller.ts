import { Controller, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { FolderService } from './folder.service';

@UseFilters(HttpExceptionFilter)
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}
}
