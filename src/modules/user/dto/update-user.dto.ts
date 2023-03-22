import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'Пароль должен иметь строковый тип' })
  @Length(6, undefined, {
    message: 'Длина пароля должна быть не меньше 6 символов!',
  })
  password?: string;

  @IsOptional()
  @IsOptional()
  name?: string;
}
