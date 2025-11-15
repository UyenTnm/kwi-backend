import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSubtype } from './product-subtype.entity';
import { slugify } from 'transliteration';
import { CreateSubtypeDto } from './dto/create-subtype.dto';
import { UpdateSubtypeDto } from './dto/update-subtype.dto';

@Injectable()
export class ProductSubtypesService {
  constructor(
    @InjectRepository(ProductSubtype)
    private readonly subtypeRepo: Repository<ProductSubtype>,
  ) {}

  async findAll(): Promise<ProductSubtype[]> {
    return this.subtypeRepo.find({
      relations: ['type'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ProductSubtype> {
    const subtype = await this.subtypeRepo.findOne({
      where: { id },
      relations: ['type'],
    });
    if (!subtype)
      throw new NotFoundException(`Subtype with ID ${id} not found`);
    return subtype;
  }

  async create(dto: CreateSubtypeDto): Promise<ProductSubtype> {
    try {
      let baseSlug = dto.slug
        ? slugify(dto.slug, { lowercase: true })
        : slugify(dto.name, { lowercase: true });

      let slug = baseSlug;
      let counter = 1;

      while (await this.subtypeRepo.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const subtype = this.subtypeRepo.create({ ...dto, slug });
      return await this.subtypeRepo.save(subtype);
    } catch (err) {
      console.error('Error creating subtype:', err);
      throw new BadRequestException('Failed to create subtype');
    }
  }

  async update(id: number, dto: UpdateSubtypeDto): Promise<ProductSubtype> {
    const subtype = await this.findOne(id);
    Object.assign(subtype, dto);

    if (dto.name && !dto.slug) {
      subtype.slug = slugify(dto.name, { lowercase: true });
    }

    return this.subtypeRepo.save(subtype);
  }

  async remove(id: number): Promise<void> {
    const subtype = await this.findOne(id);
    await this.subtypeRepo.remove(subtype);
  }
}
