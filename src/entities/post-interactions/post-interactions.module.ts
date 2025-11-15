import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { PostView } from './post-view.entity';
import { PostInteractionsService } from './post-interactions.service';
import { PostInteractionsController } from './post-interactions.controller';
import { ContentPost } from '../content-post/content-post.entity';
import { User } from '../../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostComment,
      PostLike,
      PostView,
      ContentPost,
      User,
    ]),
  ],
  providers: [PostInteractionsService],
  controllers: [PostInteractionsController],
  exports: [PostInteractionsService],
})
export class PostInteractionsModule {}
