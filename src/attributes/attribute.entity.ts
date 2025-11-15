import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';

@Entity('attributes')
@Index('uq_attributes_slug', ['slug'], { unique: true })
export class Attribute {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ default: 'text' })
  inputType!: 'text' | 'number' | 'select';

  @OneToMany(
    () => ProductAttribute,
    // 👇 Trả về 1 Attribute (không phải mảng)
    (pa: ProductAttribute): Attribute => pa.attribute,
  )
  productAttributes!: ProductAttribute[];
}
