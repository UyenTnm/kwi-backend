import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  // CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/product.entity';
import { ProductVariant } from '../../products/product-variant.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant | null;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 0 })
  quantity: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
