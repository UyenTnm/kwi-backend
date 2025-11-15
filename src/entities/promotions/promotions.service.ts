import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { Repository } from 'typeorm';
import { CreatePromotionDto, UpdatePromotionDto } from './promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promoRepo: Repository<Promotion>,
  ) {}

  findAll() {
    return this.promoRepo.find({ relations: ['product', 'category', 'brand'] });
  }

  async findOne(id: number) {
    const p = await this.promoRepo.findOne({
      where: { id },
      relations: ['product', 'category', 'brand'],
    });
    if (!p) throw new NotFoundException('Promotion not found');
    return p;
  }

  create(dto: CreatePromotionDto) {
    const p = this.promoRepo.create(dto as any);
    return this.promoRepo.save(p);
  }

  async update(id: number, dto: UpdatePromotionDto) {
    const p = await this.findOne(id);
    Object.assign(p, dto);
    return this.promoRepo.save(p);
  }

  remove(id: number) {
    return this.promoRepo.delete(id);
  }

  async findActive() {
    const now = new Date();
    return this.promoRepo
      .createQueryBuilder('p')
      .where('p.isActive = :active', { active: 1 })
      .andWhere('(p.startDate IS NULL OR p.startDate <= :now)', { now })
      .andWhere('(p.endDate IS NULL OR p.endDate >= :now)', { now })
      .getMany();
  }
}
