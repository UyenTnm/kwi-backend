import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Product } from 'src/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Product])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [TypeOrmModule],
})
export class InventoryModule {}
