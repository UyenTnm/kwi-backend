// keyboard-model.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Brand } from '../../brands/brands.entity';
import { KeyboardLayout } from './keyboard-layout.entity';

@Entity('keyboard_models')
export class KeyboardModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => Brand, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brandId' })
  brand: Brand | null;

  @ManyToOne(() => KeyboardLayout, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'layoutId' })
  layout: KeyboardLayout | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
