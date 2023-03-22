import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { roleNotFound } from 'src/common/constants/error-messages/role.errors';
import {
  PASSWORDS_EQUALS,
  USER_NOT_FOUND,
} from 'src/common/constants/error-messages/user.errors';
import { DeepPartial, FindOneOptions, Repository, SaveOptions } from 'typeorm';
import { RoleService } from '../role/role.service';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async updateUser(
    { password, ...fields }: UpdateUserDto,
    userId: number,
  ): Promise<User> {
    const user = await this.findUser({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (password) {
      const passwordEquals = await compare(password, user.password);
      if (passwordEquals) {
        throw new BadRequestException(PASSWORDS_EQUALS);
      }

      const newPassword = await hash(password, 10);
      user.password = newPassword;
    }

    return this.saveUser({
      ...user,
      ...fields,
    });
  }

  async saveUser(entity: User, options?: SaveOptions): Promise<User> {
    return await this.userRepository.save(entity, options);
  }
}
