import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { roleNotFound } from 'src/common/constants/error-messages/role.errors';
import { DeepPartial, FindOneOptions, Repository, SaveOptions } from 'typeorm';
import { RoleService } from '../role/role.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async createUser(dto: DeepPartial<User>): Promise<User> {
    const registerRole = 'USER';
    const userRole = await this.roleService.findRoleByTitle(registerRole);
    if (!userRole) {
      throw new NotFoundException(roleNotFound(registerRole));
    }
    const user = this.userRepository.create({ ...dto, roles: [userRole] });
    await this.saveUser(user);

    return user;
  }

  async findUser(options: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(options);
  }

  async saveUser(entity: User, options?: SaveOptions): Promise<User> {
    return await this.userRepository.save(entity, options);
  }
}
