import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // USER: tạo đơn hàng từ giỏ hàng
  @Post('checkout')
  async checkout(@Request() req) {
    return this.ordersService.createOrderFromCart(req.user);
  }

  // USER: xem đơn hàng của chính mình
  @Get('me')
  async getMyOrders(@Request() req) {
    return this.ordersService.getOrdersByUser(req.user.id);
  }

  // ADMIN: xem toàn bộ đơn hàng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // ADMIN: xem chi tiết 1 đơn hàng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async getOrder(@Param('id') id: number) {
    return this.ordersService.findByIdWithUser(id);
  }

  // ADMIN: cập nhật trạng thái đơn hàng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['PENDING', 'PAID', 'FULFILLED', 'CANCELED'],
        },
      },
    },
  })
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELED',
  ) {
    return this.ordersService.setStatus(id, status);
  }
}
