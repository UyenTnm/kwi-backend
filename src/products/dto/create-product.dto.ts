import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  GroupbuyType,
  ProductAvailability,
  ProductCondition,
  ProductStatus,
} from '../../common/enums/product.enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  // ===== Basic fields =====
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  detail?: string;

  // ===== Price & Stock =====
  @Type(() => Number)
  @IsNumber()
  price: number;

  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num; // tránh NaN khi frontend gửi rỗng
  })
  @Type(() => Number)
  @IsInt()
  stock: number;

  // ===== Preorder logic =====
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === 1 || value === '1')
      return true;
    return false;
  })
  @IsBoolean()
  isPreorder?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })
  estimatedDelivery?: Date | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })
  preorderDeadline?: Date | null;

  // ===== Enums =====
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const val = String(value).toUpperCase();
    if (val === 'PREORDER') return GroupbuyType.PREORDER;
    if (val === 'NORMAL') return GroupbuyType.NORMAL;
    if (val === 'GROUPBUY') return GroupbuyType.GROUPBUY;
    return undefined;
  })
  @IsEnum(GroupbuyType)
  groupbuyType?: GroupbuyType;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const val = String(value).toUpperCase();
    if (['IN_STOCK', 'PREORDER', 'OUT_OF_STOCK'].includes(val))
      return val as ProductAvailability;
    return undefined;
  })
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;

  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  // ===== Misc =====
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  brandId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  typeId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  subtypeId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  attributes?: { attributeId: number; value: string }[];
}
