import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ProductMedia } from './product-media.entity';
import { Product } from 'src/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, ProductMedia, Product])],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [TypeOrmModule],
})
export class MediaModule {}
