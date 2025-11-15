import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCategory } from './content-category.entity';
import { ContentCategoryService } from './content-category.service';
import { ContentCategoryController } from './content-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContentCategory])],
  providers: [ContentCategoryService],
  controllers: [ContentCategoryController],
  exports: [ContentCategoryService, TypeOrmModule],
})
export class ContentCategoryModule {}
