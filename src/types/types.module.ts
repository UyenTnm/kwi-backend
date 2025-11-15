import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './product-type.entity';
import { ProductSubtype } from './product-subtype.entity';
import { ProductTypesService } from './product-type.service';
import { ProductSubtypesService } from './product-subtype.service';
import { ProductTypesController } from './product-type.controller';
import { ProductSubtypesController } from './product-subtype.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType, ProductSubtype])],
  controllers: [ProductTypesController, ProductSubtypesController],
  providers: [ProductTypesService, ProductSubtypesService],
  exports: [ProductTypesService, ProductSubtypesService],
})
export class TypesModule {}
