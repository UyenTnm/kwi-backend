import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'longtext', nullable: true })
  body: string;

  @ManyToOne(() => Category, (c) => c.posts, { nullable: true })
  category?: Category;

  @ManyToOne(() => User, (u) => u.posts, { nullable: true })
  author?: User;

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
