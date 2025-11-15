import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductType } from './product-type.entity';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { slugify } from 'transliteration';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectRepository(ProductType)
    private readonly typeRepo: Repository<ProductType>,
  ) {}

  // Lấy tất cả loại sản phẩm
  async findAll(): Promise<ProductType[]> {
    return this.typeRepo.find({
      relations: ['subtypes'],
      order: { id: 'DESC' },
    });
  }

  // Lấy 1 loại sản phẩm theo ID
  async findOne(id: number): Promise<ProductType> {
    const type = await this.typeRepo.findOne({
      where: { id },
      relations: ['subtypes'],
    });
    if (!type) throw new NotFoundException('Product type not found');
    return type;
  }

  // Tạo mới
  async create(dto: CreateTypeDto): Promise<ProductType> {
    try {
      const slug =
        dto.slug && dto.slug.trim() !== ''
          ? dto.slug.trim()
          : slugify(dto.name ?? '', { lowercase: true, separator: '-' });

      const entity = this.typeRepo.create({
        ...dto,
        slug: slug || `type-${Date.now()}`,
      });

      return await this.typeRepo.save(entity);
    } catch (error) {
      console.error('Error creating type:', error);
      throw new BadRequestException('Failed to create product type');
    }
  }

  // Cập nhật
  async update(id: number, dto: UpdateTypeDto): Promise<ProductType> {
    const type = await this.findOne(id);

    if (dto.name) {
      type.name = dto.name;
      type.slug =
        dto.slug && dto.slug.trim() !== ''
          ? dto.slug.trim()
          : slugify(dto.name, { lowercase: true, separator: '-' });
    }

    if (dto.description !== undefined) {
      type.description = dto.description;
    }

    return this.typeRepo.save(type);
  }

  // Xóa
  async remove(id: number): Promise<void> {
    const type = await this.findOne(id);
    await this.typeRepo.remove(type);
  }
}
