import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_variants' })
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 CỘT FK RÕ RÀNG, KIỂU INT KHỚP VỚI products.id
  @Index()
  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' }) // 🔹 RÀNG TÊN CỘT CHO CHẮC
  product: Product;

  @Column({ type: 'varchar', length: 100 })
  name: string; // ví dụ: Màu, Size, ...

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  extraPrice: number;
}
