import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ContentPostsService } from './content-posts.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Content Posts')
@ApiBearerAuth()
@Controller('content-posts')
export class ContentPostsController {
  constructor(private readonly postService: ContentPostsService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        type: {
          type: 'string',
          enum: ['blog', 'product', 'announcement'],
        },
        productId: { type: 'number' },
        thumbnail: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  async create(
    @Req() req: any,
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user?.id;
    return this.postService.create(data, file, userId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: number,
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postService.update(id, data, file);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}
