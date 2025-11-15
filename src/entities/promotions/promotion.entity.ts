import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/product.entity';
import { Category } from '../../categories/category.entity';
import { Brand } from '../../brands/brands.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;

  @ManyToOne(() => Brand, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  brand: Brand | null;
}
