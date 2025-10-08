import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // CREATE
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        slug: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        currency: { type: 'string', enum: ['USD', 'VND', 'EUR'] },
        categoryId: { type: 'number' },
        isActive: { type: 'boolean' },
        // 2 lựa chọn: upload file hoặc gửi URL dưới key cùng tên
        image: {
          oneOf: [{ type: 'string', format: 'binary' }, { type: 'string' }],
        },
        video: {
          oneOf: [{ type: 'string', format: 'binary' }, { type: 'string' }],
        },
      },
    },
  })
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const imageFile = files?.image?.[0];
    const videoFile = files?.video?.[0];
    return this.productsService.create(dto, imageFile, videoFile);
  }

  // READ ALL
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productsService.findOne(+id);
  }

  // UPDATE
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        slug: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        currency: { type: 'string', enum: ['USD', 'VND', 'EUR'] },
        categoryId: { type: 'number' },
        isActive: { type: 'boolean' },
        image: {
          oneOf: [{ type: 'string', format: 'binary' }, { type: 'string' }],
        },
        video: {
          oneOf: [{ type: 'string', format: 'binary' }, { type: 'string' }],
        },
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const imageFile = files?.image?.[0];
    const videoFile = files?.video?.[0];
    return this.productsService.update(+id, dto, imageFile, videoFile);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productsService.remove(+id);
  }
}
