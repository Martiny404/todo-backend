import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { RemoveFilesDto } from './dto/remove-file.dto';
import { FileUploadService } from './file-upload.service';

@UseFilters(HttpExceptionFilter)
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const sharped = await this.fileUploadService.filterFile(file);
    return this.fileUploadService.saveFile(sharped, folder);
  }

  @Delete('/')
  async removeFile(@Body() dto: RemoveFilesDto) {
    return this.fileUploadService.removeFiles(dto.paths);
  }
}
