// src/products/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { CartItem } from 'src/cart/cart-item.entity';

@Entity('products')
@Index('uq_products_slug', ['slug'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  layout: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // Thumbnail chính (nullable)
  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string | null;

  // Video demo (nullable)
  @Column({ type: 'varchar', length: 255, nullable: true })
  video: string | null;

  // Trạng thái hiển thị bán
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug || this.slug.trim() === '') {
      this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }
  }

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category | null;

  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
