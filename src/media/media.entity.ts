import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ProductMedia } from './product-media.entity';
import { Product } from 'src/products/product.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title?: string;

  @Column({
    type: 'enum',
    enum: ['audio', 'video', 'youtube'],
    default: 'video',
  })
  type: 'audio' | 'video' | 'youtube';

  @Column({ nullable: true })
  audioUrl?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true })
  youtubeUrl?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @ManyToOne(() => Product, (p) => p.media, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  product?: Product;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ProductMedia, (pm) => pm.media)
  productMedia: ProductMedia[];
}
