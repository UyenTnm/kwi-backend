import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto, UpdatePromotionDto } from './promotion.dto';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly svc: PromotionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all promotions' })
  findAll() {
    return this.svc.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active promotions' })
  active() {
    return this.svc.findActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePromotionDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromotionDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
