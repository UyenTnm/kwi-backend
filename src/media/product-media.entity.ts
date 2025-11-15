import { Product } from 'src/products/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Media } from './media.entity';

@Entity('product_media')
export class ProductMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productMedia, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Media, (media) => media.productMedia, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mediaId' })
  media: Media;

  @CreateDateColumn()
  createdAt: Date;
}
