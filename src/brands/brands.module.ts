import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brands.entity';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandsService],
  controllers: [BrandsController],
  exports: [TypeOrmModule, BrandsService],
})
export class BrandsModule {}
