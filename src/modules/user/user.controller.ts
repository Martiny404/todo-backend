import { Controller, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { UserService } from './user.service';

@UseFilters(HttpExceptionFilter)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
