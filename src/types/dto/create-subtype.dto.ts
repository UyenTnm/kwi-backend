import { IsOptional, IsString, MaxLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubtypeDto {
  @ApiProperty({ example: 'TKL', description: 'Tên phân loại con' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'tkl',
    description: 'Slug SEO (nếu bỏ trống sẽ tự sinh)',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'Bàn phím Tenkeyless layout',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'ID của loại sản phẩm cha (ProductType)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  typeId?: number;
}
