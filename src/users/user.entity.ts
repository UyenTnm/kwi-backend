import { CartItem } from 'src/cart/cart-item.entity';
import { Order } from 'src/orders/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Post } from 'src/post/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', default: 'user', enum: ['user', 'admin', 'staff'] })
  role: 'user' | 'admin' | 'staff';

  @OneToMany(() => Post, (p) => p.author)
  posts: Post[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
