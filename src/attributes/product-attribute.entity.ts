import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Attribute } from './attribute.entity';

@Entity('product_attributes')
@Index(['product', 'attribute'], { unique: true })
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Product,
    // 👇 Trả về mảng ProductAttribute bên Product
    (p: Product) => p.attributes,
    { onDelete: 'CASCADE', nullable: false },
  )
  product!: Product;

  @ManyToOne(
    () => Attribute,
    // 👇 Trả về mảng ProductAttribute bên Attribute
    (a: Attribute) => a.productAttributes,
    { onDelete: 'CASCADE', nullable: false },
  )
  attribute!: Attribute;

  @Column({ type: 'varchar', length: 255 })
  value!: string;
}
