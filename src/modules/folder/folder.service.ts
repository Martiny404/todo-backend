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
import { SortMethod, SortType } from 'src/common/types/search-params.interface';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsOrderValue,
  FindOptionsWhere,
  In,
  Repository,
  SaveOptions,
} from 'typeorm';
import { Note } from '../note/entities/note.entity';
import { UserService } from '../user/user.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { GetAllFoldersDto } from './dto/get-all.dto';
import { GetOneFolderDto } from './dto/get-one.dto';
import { Folder } from './entities/folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    private readonly userService: UserService,
  ) {}

  async getAll(
    dto: GetAllFoldersDto,
    userId: number,
  ): Promise<[Folder[], number]> {
    const offset = dto.page * 9 - 9;

    const sort: FindOptionsOrderValue =
      dto.method == SortMethod.ASC ? 'ASC' : 'DESC';

    const order: FindOptionsOrder<Folder> =
      dto.sort == SortType.DATE
        ? {
            createdAt: sort,
          }
        : {
            name: sort,
          };

    const where: FindManyOptions<Folder> = {
      where: { user: { id: userId } },
      skip: offset,
      take: 9,
      order,
    };

    const res = await this.folderRepository.findAndCount(where);
    return res;
  }

  async getOne(
    dto: GetOneFolderDto,
    id: number,
    userId: number,
  ): Promise<Folder> {
    const sort: FindOptionsOrderValue =
      dto.method == SortMethod.ASC ? 'ASC' : 'DESC';

    const order: FindOptionsOrder<Note> =
      dto.sort == SortType.DATE
        ? {
            createdAt: sort,
          }
        : {
            title: sort,
          };

    const where: FindOptionsWhere<Folder> = dto.notCompleted
      ? {
          id,
          user: { id: userId },
          notes: {
            isCompleted: false,
          },
        }
      : { id, user: { id: userId } };

    return this.findFolder({
      where: where,
      relations: { notes: true },
      order: {
        notes: order,
      },
    });
  }

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
