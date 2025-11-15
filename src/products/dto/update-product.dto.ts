import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  GroupbuyType,
  ProductAvailability,
  ProductCondition,
  ProductStatus,
} from 'src/common/enums/product.enums';

export class UpdateProductDto {
  // ====== Basic fields ======
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  detail?: string;

  // ====== Pricing & Stock ======
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num; // fallback tránh NaN
  })
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  // ====== Relations ======
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  brandId?: number;

  // ====== Enum fields ======
  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const upper = String(value).toUpperCase();
    if (['IN_STOCK', 'PREORDER', 'OUT_OF_STOCK'].includes(upper))
      return upper as ProductAvailability;
    return undefined;
  })
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  // ====== Preorder logic ======
  @IsOptional()
  @Transform(({ value }) => {
    // Cho phép cả "true"/"false", boolean, số, hoặc chuỗi
    if (value === 'true' || value === true || value === 1 || value === '1')
      return true;
    if (value === 'false' || value === false || value === 0 || value === '0')
      return false;
    return false;
  })
  @IsBoolean()
  isPreorder?: boolean;

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

  // ====== Dates (safe parsing) ======
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })
  preorderDeadline?: Date | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  })
  estimatedDelivery?: Date | null;

  // ====== Media ======
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;
}
