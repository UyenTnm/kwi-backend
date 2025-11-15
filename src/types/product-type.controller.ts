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
import { ProductTypesService } from './product-type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@ApiTags('Product Types')
@Controller('types')
export class ProductTypesController {
  constructor(private readonly typesService: ProductTypesService) {}

  // Lấy danh sách
  @Get()
  async list(@Query('q') q?: string) {
    const types = await this.typesService.findAll();
    if (q) {
      const keyword = q.toLowerCase();
      return types.filter((t) => t.name.toLowerCase().includes(keyword));
    }
    return types;
  }

  // Lấy chi tiết
  @Get(':id')
  async byId(@Param('id') id: number) {
    return this.typesService.findOne(+id);
  }

  // Tạo mới
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateTypeDto) {
    return this.typesService.create(dto);
  }

  // Cập nhật
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateTypeDto) {
    return this.typesService.update(+id, dto);
  }

  // Xóa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.typesService.remove(+id);
  }
}
