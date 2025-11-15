import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('q') q?: string) {
    return this.usersService.findAll(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    console.log('🟡 Incoming update user DTO:', dto);
    return this.usersService.update(+id, dto);
  }

  @Patch(':id/toggle')
  async toggleStatus(@Param('id') id: number) {
    return this.usersService.toggleStatus(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
