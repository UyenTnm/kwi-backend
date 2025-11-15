import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ContentPost } from '../content-post/content-post.entity';
import { User } from '../../users/user.entity';

@Entity('post_likes')
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContentPost, (p) => p.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: ContentPost;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
