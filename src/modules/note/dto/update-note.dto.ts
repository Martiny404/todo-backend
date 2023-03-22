import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @Length(1)
  title: string;

  @IsOptional()
  @IsString()
  @Length(1)
  description: string;

  @IsOptional()
  @IsString()
  filePath: string;
}
