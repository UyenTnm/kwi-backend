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
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { CartItem } from 'src/cart/cart-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  // Slug duy nhất, dùng cho URL
  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  layout: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // Thumbnail chính
  @Column({ nullable: true })
  image: string;

  @BeforeInsert()
  generateSlug() {
    if (!this.slug || this.slug.trim() === '') {
      this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }
  }

  // Quan hệ tới Category
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category | null;

  // Quan hệ ngược cho ảnh & biến thể
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
