import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KeyboardService } from './keyboard.service';
import {
  CreateKeyboardLayoutDto,
  CreateKeyboardModelDto,
} from './keyboard.dto';

@ApiTags('Keyboards')
@Controller('keyboards')
export class KeyboardController {
  constructor(private readonly svc: KeyboardService) {}

  // Layouts
  @Get('layouts')
  layouts() {
    return this.svc.findLayouts();
  }

  @Get('layouts/:id')
  layout(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findLayout(id);
  }

  @Post('layouts')
  createLayout(@Body() dto: CreateKeyboardLayoutDto) {
    return this.svc.createLayout(dto);
  }

  @Patch('layouts/:id')
  updateLayout(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateKeyboardLayoutDto>,
  ) {
    return this.svc.updateLayout(id, dto);
  }

  @Delete('layouts/:id')
  removeLayout(@Param('id', ParseIntPipe) id: number) {
    return this.svc.removeLayout(id);
  }

  // Models
  @Get('models')
  models() {
    return this.svc.findModels();
  }

  @Get('models/:id')
  model(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findModel(id);
  }

  @Post('models')
  createModel(@Body() dto: CreateKeyboardModelDto) {
    return this.svc.createModel(dto);
  }

  @Patch('models/:id')
  updateModel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateKeyboardModelDto>,
  ) {
    return this.svc.updateModel(id, dto);
  }

  @Delete('models/:id')
  removeModel(@Param('id', ParseIntPipe) id: number) {
    return this.svc.removeModel(id);
  }
}
