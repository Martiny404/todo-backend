import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { AuthorizationGuard } from '../token/guards/authorization.guard';
import { RoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

@UseFilters(HttpExceptionFilter)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  //@UseGuards(AuthorizationGuard)
  @Post('/create')
  create(@Body() { title }: RoleDto) {
    return this.roleService.create(title.toUpperCase());
  }

  //@UseGuards(AuthorizationGuard)
  @Patch('/update/:id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() dto: RoleDto) {
    return this.roleService.updateRole(id, dto);
  }

  //@UseGuards(AuthorizationGuard)
  @Delete('/delete/:id')
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.roleService.removeRole(id);
  }
}
