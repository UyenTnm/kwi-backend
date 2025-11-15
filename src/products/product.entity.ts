import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { CartItem } from '../cart/cart-item.entity';
import { Brand } from '../brands/brands.entity';
import { ProductType } from '../types/product-type.entity';
import { ProductSubtype } from '../types/product-subtype.entity';
import { ProductAttribute } from '../attributes/product-attribute.entity';
import {
  ProductCondition,
  ProductAvailability,
  ProductStatus,
  GroupbuyType,
} from 'src/common/enums/product.enums';
import { KeyboardModel } from 'src/entities/keyboards/keyboard-model.entity';
import { Expose } from 'class-transformer';
import { Promotion } from 'src/entities/promotions/promotion.entity';
import { slugify } from 'transliteration';
import { ProductMedia } from 'src/media/product-media.entity';
import { Media } from 'src/media/media.entity';

@Entity('products')
@Index('uq_products_slug', ['slug'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'longtext', nullable: true })
  detail?: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  video: string | null;

  @Column({
    name: 'product_condition',
    type: 'enum',
    enum: ProductCondition,
    default: ProductCondition.NEW,
  })
  condition: ProductCondition;

  @Column({
    type: 'enum',
    enum: ProductAvailability,
    default: ProductAvailability.IN_STOCK,
  })
  availability: ProductAvailability;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.INACTIVE,
  })
  status: ProductStatus;

  // Loại groupbuy
  @Column({
    type: 'enum',
    enum: GroupbuyType,
    default: GroupbuyType.NORMAL,
  })
  groupbuyType: GroupbuyType;

  @Column({ type: 'boolean', default: false })
  isPreorder: boolean;

  @Column({ type: 'datetime', nullable: true })
  estimatedDelivery: Date | null;

  @Column({ type: 'datetime', nullable: true })
  preorderDeadline: Date | null;

  @ManyToOne(() => KeyboardModel, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'modelId' })
  model: KeyboardModel | null;

  // Brand có khóa ngoại brandId
  @ManyToOne(() => Brand, (b) => b.products, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'brandId' })
  brand: Brand | null;

  @ManyToOne(() => ProductType, (t) => t.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  type: ProductType | null;

  @ManyToOne(() => ProductSubtype, (st) => st.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  subtype: ProductSubtype | null;

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

  @OneToMany(() => ProductMedia, (pm) => pm.product, { cascade: true })
  productMedia: ProductMedia[];

  @OneToMany(() => Media, (media) => media.product, { cascade: true })
  media?: Media[];

  @OneToMany(() => ProductAttribute, (pa) => pa.product, { cascade: true })
  attributes: ProductAttribute[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @ManyToOne(() => Promotion)
  @JoinColumn({ name: 'promotionId' })
  promotion: Promotion;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (!this.slug && this.name) {
      this.slug = slugify(this.name, { lowercase: true });
    }
  }

  @Expose()
  get finalPrice(): number {
    if (this.promotion && this.promotion.isActive) {
      return Number(this.price) * (1 - this.promotion.discountPercent / 100);
    }
    return Number(this.price);
  }
}
