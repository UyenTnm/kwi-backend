import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateKeyboardLayoutDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateKeyboardModelDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsNumber()
  brandId?: number;

  @IsOptional()
  @IsNumber()
  layoutId?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
