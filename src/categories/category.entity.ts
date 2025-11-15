import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { slugify } from 'transliteration';
import { Post } from 'src/post/post.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  /**
   * Quan hệ cha – con
   * Một category có thể có nhiều category con (children)
   * và có thể có một category cha (parent)
   */
  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category | null;

  @OneToMany(() => Post, (p) => p.category)
  posts: Post[];

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  /**
   * Quan hệ với sản phẩm
   * Một category có thể chứa nhiều product
   */
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // Tự động sinh slug hợp lệ nếu thiếu hoặc trùng
  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (!this.slug || this.slug.trim() === '') {
      this.slug = slugify(this.name || `category-${Date.now()}`, {
        lowercase: true,
      });
    } else {
      // làm sạch slug người dùng nhập sai (VD: chứa ký tự đặc biệt)
      this.slug = slugify(this.slug, { lowercase: true });
    }
  }
}
