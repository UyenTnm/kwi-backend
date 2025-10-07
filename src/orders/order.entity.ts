import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  // JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
// import { OrderItem } from './order-item.entity';
import { CartItem } from 'src/cart/cart-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  // @OneToMany(() => OrderItem, (i) => i.order, { cascade: true, eager: true })
  // items: OrderItem[];

  @OneToMany(() => CartItem, (item) => item.order, { cascade: true })
  items: CartItem[];

  @Column({ type: 'int' })
  subtotal: number; // VND (int)

  @Column({ type: 'int', default: 0 })
  shippingFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number; // = subtotal + shippingFee

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELED';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
