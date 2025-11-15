import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentCategory } from './content-category.entity';

@Injectable()
export class ContentCategoryService {
  constructor(
    @InjectRepository(ContentCategory)
    private readonly repo: Repository<ContentCategory>,
  ) {}

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Category not found');
    return e;
  }

  async create(data: Partial<ContentCategory>) {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }
    const c = this.repo.create(data);
    return this.repo.save(c);
  }

  async update(id: number, data: Partial<ContentCategory>) {
    const c = await this.findOne(id);
    Object.assign(c, data);
    return this.repo.save(c);
  }

  async remove(id: number) {
    const c = await this.findOne(id);
    await this.repo.remove(c);
    return { message: 'Category deleted' };
  }
}
