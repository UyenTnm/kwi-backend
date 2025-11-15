import {
  Controller,
  Get,
  Param,
  Post as HttpPost,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  // Public routes
  @Get()
  async list() {
    return this.service.findAll();
  }

  @Get('slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get(':id')
  async byId(@Param('id') id: number) {
    return this.service.findById(+id);
  }

  // Admin routes
  @HttpPost()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() dto: CreatePostDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: number, @Body() dto: UpdatePostDto) {
    return this.service.update(+id, dto);
  }

  @Patch(':id/toggle')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async togglePublish(@Param('id') id: number) {
    return this.service.togglePublish(+id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
