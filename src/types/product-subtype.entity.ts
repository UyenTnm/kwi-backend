import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ProductType } from './product-type.entity';
import { Product } from '../products/product.entity';

@Entity('product_subtypes')
export class ProductSubtype {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @ManyToOne(() => ProductType, (type) => type.subtypes, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'typeId' })
  type: ProductType;

  @OneToMany(() => Product, (p) => p.subtype)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
