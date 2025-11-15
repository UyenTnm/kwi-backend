import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  // Lấy toàn bộ danh mục
  @Get()
  async getAll() {
    return this.service.findAll();
  }

  // Lấy danh mục theo slug hoặc id
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    // ⚡ Cho phép truyền số ID hoặc slug
    if (!isNaN(Number(slug))) {
      const id = Number(slug);
      return this.service.findById(id);
    }
    return this.service.findBySlug(slug);
  }

  // Lấy sản phẩm thuộc danh mục
  @Get(':id/products')
  async getProducts(@Param('id') id: number) {
    return this.service.findProductsByCategory(id);
  }

  // Lấy danh mục theo ID
  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  // Tạo mới (Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: any) {
    return this.service.create(dto);
  }

  // Cập nhật danh mục
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  // Xóa danh mục
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
