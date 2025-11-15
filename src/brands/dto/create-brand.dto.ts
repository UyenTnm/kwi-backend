import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ example: 'Keychron', description: 'Brand Name' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'logitech', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 'High-end mechanical keyboard manufacturer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
