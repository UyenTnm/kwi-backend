import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { ProductVariant } from '../product-variant.entity';
import { Product } from '../product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant, Product])],
  controllers: [VariantsController],
  providers: [VariantsService],
  exports: [TypeOrmModule, VariantsService],
})
export class VariantsModule {}
