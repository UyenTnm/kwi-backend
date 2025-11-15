import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ContentPost } from './content-post.entity';

@Entity('content_categories')
@Index('uq_content_category_slug', ['slug'], { unique: true })
export class ContentCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 160 })
  name: string;

  @Column({ length: 180, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => ContentPost, (p) => p.contentCategory)
  posts: ContentPost[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
