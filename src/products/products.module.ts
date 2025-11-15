import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { Category } from 'src/categories/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Brand } from 'src/brands/brands.entity';
import { ProductType } from 'src/types/product-type.entity';
import { Attribute } from 'src/attributes/attribute.entity';
import { ProductAttribute } from 'src/attributes/product-attribute.entity';
import { Promotion } from 'src/entities/promotions/promotion.entity';
import { Inventory } from 'src/entities/inventory/inventory.entity';
import { KeyboardLayout } from 'src/entities/keyboards/keyboard-layout.entity';
import { KeyboardModel } from 'src/entities/keyboards/keyboard-model.entity';
import { VariantsController } from './variants/variants.controller';
import { VariantsService } from './variants/variants.service';
import { VariantsModule } from './variants/variants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      Category,
      Brand,
      ProductType,
      Attribute,
      ProductAttribute,
      Promotion,
      Inventory,
      KeyboardLayout,
      KeyboardModel,
    ]),
    MulterModule.register({ dest: './uploads' }),
    VariantsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
