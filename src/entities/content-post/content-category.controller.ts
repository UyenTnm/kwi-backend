import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContentCategoryService } from './content-category.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Content Categories')
@Controller('content-categories')
export class ContentCategoryController {
  constructor(private readonly svc: ContentCategoryService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.svc.findOne(Number(id));
  }

  // Admin only
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Post()
  create(@Body() dto: any) {
    return this.svc.create(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: any) {
    return this.svc.update(Number(id), dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.svc.remove(Number(id));
  }
}
