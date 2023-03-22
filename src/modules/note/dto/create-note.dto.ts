import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @Length(1)
  title: string;

  @IsString()
  @Length(1)
  description: string;

  @IsNumber()
  @IsPositive()
  folderId: number;

  @IsOptional()
  @IsString()
  filePath: string;
}
