import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { plainToInstance } from 'class-transformer';
import { ProductVariantResponse } from './dto/product-variant-response.dto';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  /** Get variants by product id */
  @Get('product/:productId')
  async getByProduct(@Param('productId') productId: number) {
    const variants = await this.variantsService.findByProduct(productId);
    return plainToInstance(ProductVariantResponse, variants, {
      excludeExtraneousValues: true,
    });
  }

  /** Get variant by slug */
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const variant = await this.variantsService.findBySlug(slug);
    return plainToInstance(ProductVariantResponse, variant, {
      excludeExtraneousValues: true,
    });
  }

  /** Create variant */
  @Post()
  async create(@Body() dto: CreateVariantDto) {
    const variant = await this.variantsService.create(dto);
    return plainToInstance(ProductVariantResponse, variant, {
      excludeExtraneousValues: true,
    });
  }

  /** Update variant */
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: Partial<CreateVariantDto>,
  ) {
    const variant = await this.variantsService.update(id, dto);
    return plainToInstance(ProductVariantResponse, variant, {
      excludeExtraneousValues: true,
    });
  }

  /** Delete variant */
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.variantsService.remove(id);
    return { success: true };
  }
}
