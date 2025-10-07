import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { slugify } from 'transliteration';

@Entity('categories')
@Index('uq_categories_slug', ['slug'], { unique: true })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  categoryId: number;

  @Column()
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => Category, (category) => category.children, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (!this.slug && this.name) {
      this.slug = slugify(this.name.toLowerCase());
    }
  }

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  category: Category;
}
