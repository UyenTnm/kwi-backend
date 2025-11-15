import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Product } from '../../products/product.entity';
import { PostComment } from '../post-interactions/post-comment.entity';
import { PostLike } from '../post-interactions/post-like.entity';
import { PostView } from '../post-interactions/post-view.entity';
import { ContentCategory } from './content-category.entity';

@Entity('content_posts')
export class ContentPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({
    type: 'enum',
    enum: ['blog', 'product', 'announcement'],
    default: 'blog',
  })
  type: 'blog' | 'product' | 'announcement';

  // inside class ContentPost
  @OneToMany(() => PostComment, (c) => c.post, { cascade: true })
  comments: PostComment[];

  @OneToMany(() => PostLike, (l) => l.post)
  likes: PostLike[];

  @OneToMany(() => PostView, (v) => v.post)
  views: PostView[];

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author: User | null;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'productId' })
  product: Product | null;

  @ManyToOne(() => ContentCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'contentCategoryId' })
  contentCategory: ContentCategory | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
