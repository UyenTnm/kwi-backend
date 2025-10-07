import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ Create product (admin)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    return await this.productsService.create(body, file);
  }

  // ✅ Get all products (user + admin)
  @Get()
  async findAll(@Query('categoryId') categoryId?: number): Promise<Product[]> {
    return await this.productsService.findAll(
      categoryId ? +categoryId : undefined,
    );
  }

  // ✅ Get one product
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return await this.productsService.findOne(id);
  }

  // ✅ Update product (admin)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.productsService.update(id, body, file);
  }

  // ✅ Delete product (admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }
}
