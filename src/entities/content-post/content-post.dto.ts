import { IsString, IsOptional, IsIn, IsNumber } from 'class-validator';

export class CreateContentPostDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsIn(['blog', 'product', 'announcement'])
  type?: 'blog' | 'product' | 'announcement';

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;
}

export class UpdateContentPostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsIn(['blog', 'product', 'announcement'])
  type?: 'blog' | 'product' | 'announcement';

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;
}
