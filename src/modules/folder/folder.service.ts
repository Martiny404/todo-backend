import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FOLDER_NAME_EXIST,
  FOLDER_NOT_FOUND,
} from 'src/common/constants/error-messages/folder.errors';
import { USER_NOT_FOUND } from 'src/common/constants/error-messages/user.errors';
import { FindOneOptions, In, Repository, SaveOptions } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { Folder } from './entities/folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    private readonly userService: UserService,
  ) {}

  async saveFolder(entity: Folder, options?: SaveOptions): Promise<Folder> {
    return await this.folderRepository.save(entity, options);
  }

  async findFolder(options: FindOneOptions<Folder>): Promise<Folder> {
    return this.folderRepository.findOne(options);
  }

  async create({ name }: CreateFolderDto, userId: number): Promise<Folder> {
    const user = await this.userService.findUser({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const existName = await this.checkFolderName(user.id, name);

    if (existName) {
      throw new BadRequestException(FOLDER_NAME_EXIST);
    }
    const folder = this.folderRepository.create({
      name,
      user: { id: user.id },
    });
    return this.saveFolder(folder);
  }

  async changeName(
    id: number,
    newName: string,
    userId: number,
  ): Promise<Folder> {
    const folder = await this.findFolder({
      where: { id, user: { id: userId } },
      relations: { user: true },
    });

    if (!folder) {
      throw new NotFoundException(FOLDER_NOT_FOUND);
    }

    const existName = await this.checkFolderName(folder.user.id, newName);

    if (existName) {
      throw new BadRequestException(FOLDER_NAME_EXIST);
    }

    folder.name = newName;
    return this.saveFolder(folder);
  }

  async checkFolderName(userId: number, name: string): Promise<Folder> {
    const folders = await this.folderRepository.find({
      where: { user: { id: userId } },
    });
    const existName = folders.find((folder) => folder.name === name);
    return existName;
  }

  async removeFolders(ids: number[], userId: number): Promise<Folder[]> {
    const folders = await this.folderRepository.find({
      where: {
        id: In(ids),
        user: { id: userId },
      },
    });
    return this.folderRepository.remove(folders);
  }
}
