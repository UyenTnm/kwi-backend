import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { PostView } from './post-view.entity';
import { ContentPost } from '../content-post/content-post.entity';
import { User } from '../../users/user.entity';

@Injectable()
export class PostInteractionsService {
  constructor(
    @InjectRepository(PostComment) private commentRepo: Repository<PostComment>,
    @InjectRepository(PostLike) private likeRepo: Repository<PostLike>,
    @InjectRepository(PostView) private viewRepo: Repository<PostView>,
    @InjectRepository(ContentPost) private postRepo: Repository<ContentPost>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // COMMENTS
  async createComment(
    postId: number,
    userId: number,
    dto: any,
    imageUrls: string[] = [],
  ) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comment = this.commentRepo.create({
      post,
      user,
      content: dto.content,
      images: imageUrls.length ? JSON.stringify(imageUrls) : null,
      parent: dto.parentId ? { id: dto.parentId } : null,
    });
    return this.commentRepo.save(comment);
  }

  async listComments(postId: number, page = 1, limit = 10) {
    const [items, total] = await this.commentRepo.findAndCount({
      where: { post: { id: postId } },
      relations: ['user', 'children'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    // parse images JSON
    const data = items.map((i) => ({
      ...i,
      images: i.images ? JSON.parse(i.images) : [],
    }));
    return { data, pagination: { total, page, limit } };
  }

  async deleteComment(
    commentId: number,
    requesterId: number,
    isAdmin: boolean,
  ) {
    const c = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!c) throw new NotFoundException('Comment not found');
    if (!isAdmin && c.user.id !== requesterId)
      throw new ForbiddenException('Not allowed');
    await this.commentRepo.remove(c);
    return { message: 'Deleted' };
  }

  // LIKES (toggle)
  async toggleLike(postId: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    const existing = await this.likeRepo.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (existing) {
      await this.likeRepo.remove(existing);
      return { liked: false };
    } else {
      const like = this.likeRepo.create({ post, user: { id: userId } as User });
      await this.likeRepo.save(like);
      return { liked: true };
    }
  }

  async countLikes(postId: number) {
    return this.likeRepo.count({ where: { post: { id: postId } } });
  }

  // VIEWS (unique by user or ip)
  async recordView(postId: number, userId?: number, ip?: string) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    // if userId present: check if already viewed in last X hours (simple version: once)
    if (userId) {
      const exists = await this.viewRepo.findOne({
        where: { post: { id: postId }, user: { id: userId } },
      });
      if (exists) return { viewed: true };
      const view = this.viewRepo.create({ post, user: { id: userId } as User });
      await this.viewRepo.save(view);
      return { viewed: true };
    } else if (ip) {
      const exists = await this.viewRepo.findOne({
        where: { post: { id: postId }, ip },
      });
      if (exists) return { viewed: true };
      const view = this.viewRepo.create({ post, ip });
      await this.viewRepo.save(view);
      return { viewed: true };
    }
    return { viewed: false };
  }

  async countViews(postId: number) {
    return this.viewRepo.count({ where: { post: { id: postId } } });
  }
}
