import {
  Body,
  Controller,
  Patch,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppClientRequest } from 'src/common/types/client-request.interface';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { AuthorizationGuard } from '../token/guards/authorization.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@UseFilters(HttpExceptionFilter)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthorizationGuard)
  @Patch('/update')
  updateUser(@Body() dto: UpdateUserDto, @Req() req: AppClientRequest) {
    const userId = req.user.id;
    return this.userService.updateUser(dto, userId);
  }
}
