import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentPost } from './content-post.entity';
import { ContentPostsService } from './content-posts.service';
import { ContentPostsController } from './content-posts.controller';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentPost, Product, User])],
  providers: [ContentPostsService],
  controllers: [ContentPostsController],
  exports: [ContentPostsService, TypeOrmModule],
})
export class ContentPostsModule {}
