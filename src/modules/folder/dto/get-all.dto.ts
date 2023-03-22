import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SortMethod, SortType } from 'src/common/types/search-params.interface';
import {
  toNumber,
  toSortMethod,
  toSortType,
} from 'src/common/utils/transform.util';

export class GetAllFoldersDto {
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @Transform(({ value }) => toSortType(value))
  @IsOptional()
  @IsString()
  sort?: SortType = SortType.DATE;

  @Transform(({ value }) => toSortMethod(value))
  @IsOptional()
  @IsString()
  method?: SortMethod = SortMethod.ASC;

  // @Transform(({ value }) => toBoolean(value))
  // @IsOptional()
  // @IsBoolean()
  // notCompleted?: boolean = false;
}
