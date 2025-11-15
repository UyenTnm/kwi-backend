import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true })
  slug: string;

  // SEO subtitle
  @Column({ type: 'varchar', length: 255, nullable: true })
  subtitle?: string;

  // summary dùng để preview hoặc feed RSS
  @Column({ type: 'text', nullable: true })
  summary?: string;

  // Nội dung chính
  @Column({ type: 'longtext' })
  content: string;

  // Ảnh cover hiển thị ngoài blog
  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: false })
  published: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @ManyToOne(() => User, { nullable: true })
  author?: User;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable({ name: 'post_products' })
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
