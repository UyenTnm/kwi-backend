import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly service: BrandsService) {}

  // Lấy danh sách Brand (có thể thêm tìm kiếm bằng q)
  @Get()
  async findAll(@Query('q') q?: string) {
    const brands = await this.service.findAll();
    if (q) {
      // nếu có từ khoá q, lọc đơn giản phía controller (optional)
      return brands.filter((b) =>
        b.name.toLowerCase().includes(q.toLowerCase()),
      );
    }
    return brands;
  }

  // Lấy brand theo id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  // Tạo mới brand (chỉ admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateBrandDto) {
    return this.service.create(dto);
  }

  // Cập nhật brand (chỉ admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateBrandDto) {
    return this.service.update(+id, dto);
  }

  // Xoá brand (chỉ admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
