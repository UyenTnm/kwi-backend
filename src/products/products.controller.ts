import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from 'src/common/enums/product.enums';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //  CREATE with file upload
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'products'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    }),
  )
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    try {
      const image = files?.find((f) => f.fieldname === 'image');
      const video = files?.find((f) => f.fieldname === 'video');

      return this.productsService.create({
        ...dto,
        image: image ? `/uploads/products/${image.filename}` : undefined,
        video: video ? `/uploads/products/${video.filename}` : undefined,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      throw new BadRequestException('Failed to upload product');
    }
  }

  @Post(':id/gallery')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: join(
          __dirname,
          '..',
          '..',
          'uploads',
          'products',
          'gallery',
        ),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 500 * 1024 * 1024 }, // tối đa 500MB mỗi file
    }),
  )
  async uploadGallery(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.addGallery(+id, files);
  }

  //  READ ALL
  @Get()
  async findAll(
    @Query('categoryId') categoryId?: number,
    @Query('status') status?: ProductStatus,
  ) {
    return this.productsService.findAll();
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productsService.findOne(+id);
  }

  // UPDATE
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'products'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    const image = files?.find((f) => f.fieldname === 'image');
    const video = files?.find((f) => f.fieldname === 'video');

    return this.productsService.update(+id, {
      ...dto,
      image: image ? `/uploads/products/${image.filename}` : undefined,
      video: video ? `/uploads/products/${video.filename}` : undefined,
    });
  }

  // TOGGLE STATUS
  @Patch(':id/toggle')
  async toggleStatus(@Param('id') id: number) {
    const product = await this.productsService.toggleStatus(+id);
    return { success: true, product };
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productsService.remove(+id);
  }
}
