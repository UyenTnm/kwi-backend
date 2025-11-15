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

  @Index()
  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  /** Ví dụ: "Teal", "Bronze", "Black" */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /** Mã màu dùng cho hiển thị UI */
  @Column({ type: 'varchar', length: 7, nullable: true })
  colorHex?: string | null;

  /** Ảnh riêng cho variant (nếu có) */
  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string | null;

  /** Slug riêng: keychron-k6-pro-bronze */
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  slug?: string | null;

  /** Giá bán ra cho khách hàng */
  @Column('decimal', { precision: 10, scale: 2 })
  salePrice: number;

  /** Giá nhập (ẩn, chỉ admin xem) */
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costPrice: number;

  /** Tồn kho riêng của variant */
  @Column({ type: 'int', default: 0 })
  stock: number;

  /** Nếu variant này ngừng bán */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
