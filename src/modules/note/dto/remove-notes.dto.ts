import { IsNumber } from 'class-validator';

export class RemoveNotesDto {
  @IsNumber(undefined, { each: true })
  ids: number[];
}
