import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ContentPost } from '../content-post/content-post.entity';
import { User } from '../../users/user.entity';

@Entity('post_views')
export class PostView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContentPost, (p) => p.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: ContentPost;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ip: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
