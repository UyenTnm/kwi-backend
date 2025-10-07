import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // Lấy tất cả danh mục (kèm danh mục con)
  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({
      relations: ['children'],
      order: { id: 'ASC' },
    });
  }

  // Lấy danh mục theo ID (kèm con + sản phẩm)
  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['children', 'parent', 'products'],
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  // Lấy danh mục theo slug (cho SEO)
  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { slug },
      relations: ['children', 'parent', 'products'],
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  // Lấy sản phẩm theo category ID
  async findProductsByCategory(id: number): Promise<Product[]> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    return this.productRepo.find({
      where: { category: { id } },
      relations: ['category'],
      order: { id: 'DESC' },
    });
  }

  // Tạo mới category
  async create(dto: Partial<Category>): Promise<Category> {
    let parent: Category | null = null;
    if (dto.parent) {
      parent = await this.categoryRepo.findOne({
        where: { id: dto.parent as any },
      });
    }

    const category = this.categoryRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      parent: parent ?? null,
    });

    return this.categoryRepo.save(category);
  }

  // Cập nhật category
  async update(id: number, dto: Partial<Category>): Promise<Category> {
    const category = await this.findById(id);
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  // Xóa category
  async remove(id: number): Promise<void> {
    const category = await this.findById(id);
    await this.categoryRepo.remove(category);
  }
}
