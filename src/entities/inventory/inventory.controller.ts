import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inventory') // hiển thị trong Swagger
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all inventory record' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detail of a specific inventory record' })
  findOne(@Param('id') id: number) {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new inventory record' })
  create(@Body() data: any) {
    return this.inventoryService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory record information' })
  update(@Param('id') id: number, @Body() data: any) {
    return this.inventoryService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inventory record' })
  remove(@Param('id') id: number) {
    return this.inventoryService.remove(id);
  }
}
