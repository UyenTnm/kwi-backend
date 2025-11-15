import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Media } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private repo: Repository<Media>,
  ) {}

  async create(data: DeepPartial<Media>) {
    const media = this.repo.create(data);
    return this.repo.save(media);
  }

  async findAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Media not found');
    return this.repo.remove(found);
  }
}
