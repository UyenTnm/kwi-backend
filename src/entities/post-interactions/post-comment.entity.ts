import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ContentPost } from '../content-post/content-post.entity';
import { User } from '../../users/user.entity';

@Entity('post_comments')
export class PostComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContentPost, (p) => p.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: ContentPost;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // threaded: parent comment id (nullable)
  @ManyToOne(() => PostComment, (c) => c.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: PostComment | null;

  @OneToMany(() => PostComment, (c) => c.parent)
  children: PostComment[];

  @Column({ type: 'text' })
  content: string;

  // store array of image urls: MySQL can't store array directly -> store JSON/text
  @Column({ type: 'text', nullable: true })
  images: string | null; // JSON string array of urls

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
