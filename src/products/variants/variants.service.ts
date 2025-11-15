import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../product-variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { slugify } from 'transliteration';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  /** Lấy tất cả variants của 1 product */
  async findByProduct(productId: number): Promise<ProductVariant[]> {
    return this.variantRepo.find({ where: { productId } });
  }

  /** Lấy 1 variant theo slug */
  async findBySlug(slug: string): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOne({ where: { slug } });
    if (!variant) throw new NotFoundException('Variant not found');
    return variant;
  }

  /** Tạo mới variant */
  async create(dto: CreateVariantDto): Promise<ProductVariant> {
    try {
      const slug =
        dto.slug?.trim() ||
        slugify(`${dto.name}-${dto.productId}`, { lowercase: true });

      const variant = this.variantRepo.create({
        ...dto,
        slug,
        isActive: dto.isActive ?? true,
      });

      return await this.variantRepo.save(variant);
    } catch (err) {
      console.error('Error creating variant:', err);
      throw new BadRequestException('Failed to create variant');
    }
  }

  /** Cập nhật variant */
  async update(
    id: number,
    dto: Partial<CreateVariantDto>,
  ): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOne({ where: { id } });
    if (!variant) throw new NotFoundException('Variant not found');

    Object.assign(variant, dto);

    if (dto.name && !dto.slug) {
      variant.slug = slugify(`${dto.name}-${variant.productId}`, {
        lowercase: true,
      });
    }

    return await this.variantRepo.save(variant);
  }

  /** Xoá variant */
  async remove(id: number): Promise<void> {
    const variant = await this.variantRepo.findOne({ where: { id } });
    if (!variant) throw new NotFoundException('Variant not found');
    await this.variantRepo.remove(variant);
  }
}
