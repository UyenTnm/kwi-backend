import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 CỘT FK RÕ RÀNG, KIỂU INT KHỚP
  @Index()
  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' }) // 🔹 RÀNG TÊN CỘT
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  url: string;
}
