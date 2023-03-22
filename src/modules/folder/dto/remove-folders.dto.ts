import { IsNumber } from 'class-validator';

export class RemoveFoldersDto {
  @IsNumber(undefined, { each: true })
  ids: number[];
}
