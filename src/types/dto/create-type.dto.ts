import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeDto {
  @ApiProperty({ example: 'Keyboard', description: 'Tên loại sản phẩm' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'keyboard',
    required: false,
    description: 'Slug SEO (nếu bỏ trống sẽ tự sinh)',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'Các sản phẩm bàn phím cơ, bàn phím laptop,...',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
