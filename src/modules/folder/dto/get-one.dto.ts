import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { SortMethod, SortType } from 'src/common/types/search-params.interface';
import {
  toBoolean,
  toSortMethod,
  toSortType,
} from 'src/common/utils/transform.util';

export class GetOneFolderDto {
  @Transform(({ value }) => toSortType(value))
  @IsOptional()
  @IsString()
  sort?: SortType = SortType.DATE;

  @Transform(({ value }) => toSortMethod(value))
  @IsOptional()
  @IsString()
  method?: SortMethod = SortMethod.ASC;

  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  notCompleted?: boolean;
}
