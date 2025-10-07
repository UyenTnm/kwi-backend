import { Transform } from 'class-transformer';
import { IsInt, IsIn, IsOptional, IsString, Min } from 'class-validator';

const toIntOrUndef = ({ value }: { value: any }) =>
  value === undefined || value === null || value === ''
    ? undefined
    : parseInt(value, 10);

export class QueryProductDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(toIntOrUndef)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(toIntOrUndef)
  @IsInt()
  @Min(1)
  pageSize?: number = 12;

  @IsOptional()
  @IsIn([
    'created_desc',
    'created_asc',
    'price_desc',
    'price_asc',
    'name_asc',
    'name_desc',
  ])
  sort?:
    | 'created_desc'
    | 'created_asc'
    | 'price_desc'
    | 'price_asc'
    | 'name_asc'
    | 'name_desc' = 'created_desc';

  @IsOptional()
  @Transform(toIntOrUndef)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(toIntOrUndef)
  @IsInt()
  @Min(0)
  maxPrice?: number;
}
