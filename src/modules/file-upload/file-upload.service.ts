import { BadRequestException, Injectable } from '@nestjs/common';
import { MFile } from './classes/mfile.class';
import * as sharp from 'sharp';
import { BadTry } from './classes/bad-try.class';
import { join, parse } from 'path';
import { createWriteStream, existsSync } from 'fs';
import { access, mkdir, rm } from 'fs/promises';
import { v4 } from 'uuid';
import { BufferStream } from './classes/buffer-stream.class';
import { pipeline } from 'stream/promises';
import { FileSystemResponse } from './classes/file-response.class';

@Injectable()
export class FileUploadService {
  async saveFile(file: MFile, folder = 'default') {
    const uploadFolder = this.getFullPath('static', folder);

    try {
      await access(uploadFolder);
    } catch (e) {
      await mkdir(uploadFolder, { recursive: true });
    }

    const fullname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
    const ext = parse(fullname).ext;
    const mimetype = file.mimetype;
    const newName = `${v4()}${ext}`;
    const newFilePath = join(uploadFolder, newName);
    if (existsSync(newFilePath)) {
      throw new BadRequestException('Файл уже существует!');
    }

    const rs = new BufferStream(file.buffer);
    const ws = createWriteStream(newFilePath);
    await pipeline(rs, ws);
    return new FileSystemResponse(
      join(`/static/${folder}/${newName}`),
      newName,
      mimetype,
    );
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

  async filterFile(file: MFile) {
    const mimetype = file.mimetype;
    const currentFileType = file.mimetype.split('/')[1];
    const newName = file.originalname.split('.')[0];
    const type = file.originalname.split('.')[1];
    const size = file.size;
    if (mimetype.includes('image')) {
      if (currentFileType != 'svg+xml') {
        const buffer = await this.convertToWebP(file.buffer);
        return new MFile({
          buffer,
          originalname: `${newName}.webp`,
          mimetype,
          size,
        });
      }
      return new MFile({
        buffer: file.buffer,
        originalname: `${newName}.svg`,
        mimetype,
        size,
      });
    }
    return new MFile({
      buffer: file.buffer,
      originalname: `${newName}.${type}`,
      mimetype,
      size,
    });
  }

  getFullPath(...path: string[]) {
    const full = join(process.cwd(), ...path);
    return full;
  }

  async removeFiles(paths: string[]) {
    const badTries: BadTry[] = [];
    await Promise.allSettled(
      paths.map(async (path) => {
        try {
          const rmPath = this.getFullPath(path);
          if (existsSync(rmPath)) {
            await rm(rmPath);
          }
        } catch (e: unknown) {
          const message = `Ошибка при удалени файла по пути: ${path}`;
          badTries.push(new BadTry(path, message));
        }
      }),
    );
    return badTries;
  }
}
