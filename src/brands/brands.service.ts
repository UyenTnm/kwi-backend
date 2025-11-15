import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brands.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { slugify } from 'transliteration';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  /* 🧩 Get all brands */
  async findAll(): Promise<Brand[]> {
    return this.brandRepo.find({
      order: { id: 'DESC' },
    });
  }

  /* 🧩 Get brand by id */
  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) throw new NotFoundException(`Brand with id ${id} not found`);
    return brand;
  }

  /* 🧩 Create new brand */
  async create(dto: CreateBrandDto): Promise<Brand> {
    const existing = await this.brandRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException('Brand name already exists');
    }

    // Generate unique slug
    let baseSlug = dto.slug
      ? slugify(dto.slug, { lowercase: true })
      : slugify(dto.name, { lowercase: true });

    let slug = baseSlug;
    let counter = 1;
    while (await this.brandRepo.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const brand = this.brandRepo.create({
      ...dto,
      slug,
      isActive: dto.isActive ?? true,
    });

    return await this.brandRepo.save(brand);
  }

  /* 🧩 Update brand */
  async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);

    if (dto.name && dto.name !== brand.name) {
      const nameExists = await this.brandRepo.findOne({
        where: { name: dto.name },
      });
      if (nameExists && nameExists.id !== id) {
        throw new BadRequestException('Brand name already exists');
      }
    }

    Object.assign(brand, dto);

    // Auto regenerate slug if name changed & slug not provided
    if (dto.name && !dto.slug) {
      brand.slug = slugify(dto.name, { lowercase: true });
    }

    return this.brandRepo.save(brand);
  }

  /* 🧩 Toggle status (Active/Inactive) */
  async toggleStatus(id: number): Promise<Brand> {
    const brand = await this.findOne(id);
    brand.isActive = !brand.isActive;
    return this.brandRepo.save(brand);
  }

  /* 🧩 Delete brand */
  async remove(id: number): Promise<{ message: string }> {
    const brand = await this.findOne(id);
    await this.brandRepo.remove(brand);
    return { message: `Brand with id ${id} deleted successfully` };
  }
}
