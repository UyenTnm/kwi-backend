import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Param,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Media } from './media.entity';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('media')
export class MediaController {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {}

  // 📌 1. Upload file video/audio
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'media'),
        filename: (_, file, callback) => {
          const unique = uuidv4() + extname(file.originalname);
          callback(null, unique);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const mime = file.mimetype;
    const type = mime.startsWith('video')
      ? 'video'
      : mime.startsWith('audio')
        ? 'audio'
        : 'unknown';

    const media = this.mediaRepo.create({
      title: file.originalname,
      type,
      videoUrl: type === 'video' ? `/uploads/media/${file.filename}` : null,
      audioUrl: type === 'audio' ? `/uploads/media/${file.filename}` : null,
    } as DeepPartial<Media>);

    return this.mediaRepo.save(media);
  }

  // 📌 2. Thêm clip từ YouTube
  @Post('youtube')
  async addYouTube(@Body() body: { title: string; youtubeUrl: string }) {
    if (
      !body.youtubeUrl.includes('youtube.com') &&
      !body.youtubeUrl.includes('youtu.be')
    ) {
      throw new BadRequestException('Invalid YouTube link');
    }

    const media = this.mediaRepo.create({
      title: body.title,
      type: 'youtube',
      youtubeUrl: body.youtubeUrl,
    });
    return this.mediaRepo.save(media);
  }

  // 📌 3. Lấy toàn bộ media
  @Get()
  async findAll() {
    return this.mediaRepo.find({ order: { id: 'DESC' } });
  }

  // 📌 4. Lấy theo product (nếu sau này có gắn vào sản phẩm)
  @Get('by-product/:id')
  async findByProduct(@Param('id') id: number) {
    return this.mediaRepo.find({
      where: { product: { id } },
      order: { id: 'DESC' },
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media by ID' })
  @ApiResponse({ status: 200, description: 'Media deleted successfully.' })
  async remove(@Param('id') id: number) {
    await this.mediaRepo.delete(id);
    return { success: true };
  }
}
