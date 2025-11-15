import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ProductSubtype } from './product-subtype.entity';
import { Product } from '../products/product.entity';

@Entity('product_types')
export class ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => ProductSubtype, (st) => st.type)
  subtypes: ProductSubtype[];

  @OneToMany(() => Product, (p) => p.type)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
