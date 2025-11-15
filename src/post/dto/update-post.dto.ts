import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Top 5 bàn phím cơ 2025', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'top-5-ban-phim-co-2025', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'Khám phá 5 bàn phím cơ tốt nhất năm 2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    example:
      'Một bài tổng hợp chi tiết về 5 bàn phím cơ được đánh giá cao nhất năm 2025.',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ example: '<p>Nội dung HTML/Markdown...</p>', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: '/uploads/posts/cover.jpg', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ example: '2025-10-15T10:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  publishedAt?: string | null;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs sản phẩm liên quan',
    required: false,
  })
  @IsOptional()
  @IsArray()
  productIds?: number[];
}
