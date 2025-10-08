// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  private toPublicUrl(filename?: string | null): string | null {
    return filename ? `/uploads/${filename}` : null;
  }

  // CREATE
  async create(
    dto: CreateProductDto,
    imageFile?: Express.Multer.File,
    videoFile?: Express.Multer.File,
  ): Promise<Product> {
    const {
      categoryId,
      currency,
      image: imageUrlFromBody,
      video: videoUrlFromBody,
      ...rest
    } = dto;

    const category = categoryId
      ? await this.categoryRepo.findOne({ where: { id: +categoryId } })
      : undefined;

    const product = this.productRepo.create({
      ...rest,
      price: Number(dto.price),
      stock: Number(dto.stock ?? 0),
      currency: currency ?? 'USD',
      isActive: dto.isActive ?? true,
      category: category ?? null,
      image: imageFile
        ? this.toPublicUrl(imageFile.filename)
        : (imageUrlFromBody ?? null),
      video: videoFile
        ? this.toPublicUrl(videoFile.filename)
        : (videoUrlFromBody ?? null),
    });

    return await this.productRepo.save(product);
  }

  // FIND ALL
  async findAll(categoryId?: number): Promise<Product[]> {
    const where = categoryId ? { category: { id: categoryId } } : {};
    return await this.productRepo.find({
      where,
      relations: ['category', 'images', 'variants'],
      order: { id: 'DESC' },
    });
  }

  // FIND ONE
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'images', 'variants'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // UPDATE
  async update(
    id: number,
    dto: UpdateProductDto,
    imageFile?: Express.Multer.File,
    videoFile?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.findOne(id);

    const {
      categoryId,
      currency,
      image: imageUrlFromBody,
      video: videoUrlFromBody,
      ...rest
    } = dto;

    Object.assign(product, rest);

    if (categoryId != null) {
      const category = await this.categoryRepo.findOne({
        where: { id: +categoryId },
      });
      product.category = category ?? null;
    }

    // IMAGE: ưu tiên file, nếu body có gửi (kể cả rỗng) thì theo body
    if (imageFile) {
      product.image = this.toPublicUrl(imageFile.filename);
    } else if (imageUrlFromBody !== undefined) {
      product.image = imageUrlFromBody || null;
    }

    // VIDEO: tương tự
    if (videoFile) {
      product.video = this.toPublicUrl(videoFile.filename);
    } else if (videoUrlFromBody !== undefined) {
      product.video = videoUrlFromBody || null;
    }

    // currency
    product.currency = currency ?? product.currency ?? 'USD';

    // stock/price nếu FE gửi string
    if ((product as any).price != null) {
      (product as any).price = Number((product as any).price);
    }
    if ((product as any).stock != null) {
      (product as any).stock = Number((product as any).stock);
    }

    return await this.productRepo.save(product);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
