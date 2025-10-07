import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // CREATE
  async create(data: any, file?: Express.Multer.File): Promise<Product> {
    const { categoryId, ...rest } = data;

    const category = categoryId
      ? await this.categoryRepo.findOne({ where: { id: +categoryId } })
      : undefined;

    // ép kiểu an toàn theo khuyến nghị TS
    const product = this.productRepo.create({
      ...rest,
      image: file ? file.filename : undefined,
      category,
    }) as unknown as Product;

    return await this.productRepo.save(product);
  }

  // FIND ALL (optional categoryId)
  async findAll(categoryId?: number): Promise<Product[]> {
    const where = categoryId ? { category: { id: categoryId } } : {};
    return await this.productRepo.find({
      where,
      relations: ['category', 'images', 'variants'],
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
    data: any,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, ...rest } = data;

    Object.assign(product, rest);

    if (categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: +categoryId },
      });
      product.category = category ?? null;
    }

    if (file) {
      product.image = file.filename;
    }

    return await this.productRepo.save(product);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
