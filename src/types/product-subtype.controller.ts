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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ProductSubtypesService } from './product-subtype.service';
import { CreateSubtypeDto } from './dto/create-subtype.dto';
import { UpdateSubtypeDto } from './dto/update-subtype.dto';

@ApiTags('Product Subtypes')
@Controller('subtypes')
export class ProductSubtypesController {
  constructor(private readonly subtypesService: ProductSubtypesService) {}

  // 🔍 Danh sách
  @Get()
  async list(@Query('q') q?: string) {
    const subs = await this.subtypesService.findAll();
    if (q) {
      const keyword = q.toLowerCase();
      return subs.filter((s) => s.name.toLowerCase().includes(keyword));
    }
    return subs;
  }

  // 🔎 Lấy chi tiết
  @Get(':id')
  async byId(@Param('id') id: number) {
    return this.subtypesService.findOne(+id);
  }

  // ➕ Tạo mới
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateSubtypeDto) {
    return this.subtypesService.create(dto);
  }

  // ✏️ Cập nhật
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateSubtypeDto) {
    return this.subtypesService.update(+id, dto);
  }

  // ❌ Xóa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.subtypesService.remove(+id);
  }
}
