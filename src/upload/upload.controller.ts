import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Controller xử lý upload file: posts, products (single & gallery)
 */
@Controller('upload')
export class UploadController {
  //  Upload ảnh cho bài viết (Post)
  @Post('posts')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'posts'),
        filename: (_, file, callback) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  uploadPostImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/posts/${file.filename}` };
  }

  // Upload ảnh sản phẩm chính (single)
  @Post('products')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'products'),
        filename: (_, file, callback) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/products/${file.filename}` };
  }

  // Upload nhiều ảnh sản phẩm (gallery)
  @Post('products/gallery')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'products'),
        filename: (_, file, callback) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  uploadProductGallery(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => ({
      url: `/uploads/products/${file.filename}`,
    }));
  }
}
