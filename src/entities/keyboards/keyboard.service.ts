import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateKeyboardLayoutDto,
  CreateKeyboardModelDto,
} from './keyboard.dto';
import { KeyboardLayout } from './keyboard-layout.entity';
import { KeyboardModel } from './keyboard-model.entity';

@Injectable()
export class KeyboardService {
  constructor(
    @InjectRepository(KeyboardLayout)
    private layoutRepo: Repository<KeyboardLayout>,
    @InjectRepository(KeyboardModel)
    private modelRepo: Repository<KeyboardModel>,
  ) {}

  // Layouts
  findLayouts() {
    return this.layoutRepo.find();
  }
  async findLayout(id: number) {
    const e = await this.layoutRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Layout not found');
    return e;
  }
  createLayout(dto: CreateKeyboardLayoutDto) {
    return this.layoutRepo.save(this.layoutRepo.create(dto as any));
  }
  updateLayout(id: number, dto: Partial<CreateKeyboardLayoutDto>) {
    return this.layoutRepo.update(id, dto);
  }
  removeLayout(id: number) {
    return this.layoutRepo.delete(id);
  }

  // Models
  findModels() {
    return this.modelRepo.find({ relations: ['brand', 'layout'] });
  }
  async findModel(id: number) {
    const e = await this.modelRepo.findOne({
      where: { id },
      relations: ['brand', 'layout'],
    });
    if (!e) throw new NotFoundException('Model not found');
    return e;
  }
  createModel(dto: CreateKeyboardModelDto) {
    return this.modelRepo.save(this.modelRepo.create(dto as any));
  }
  updateModel(id: number, dto: Partial<CreateKeyboardModelDto>) {
    return this.modelRepo.update(id, dto);
  }
  removeModel(id: number) {
    return this.modelRepo.delete(id);
  }
}
