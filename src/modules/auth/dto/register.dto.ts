import { IsString, Length } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsString({ message: 'Имя должен иметь строковый тип' })
  @Length(3, undefined, {
    message: 'Длина имени должна быть не меньше 1 символа!',
  })
  name: string;
}
