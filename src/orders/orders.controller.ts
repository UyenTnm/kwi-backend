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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderResponse } from './dto/order-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** USER: tạo đơn hàng từ giỏ hàng */
  @Post('checkout')
  @ApiOkResponse({ type: OrderResponse })
  async checkout(@Request() req): Promise<OrderResponse> {
    return this.ordersService.createOrderFromCart(req.user);
  }

  /** USER: xem đơn hàng của chính mình */
  @Get('me')
  @ApiOkResponse({ type: [OrderResponse] })
  async getMyOrders(@Request() req): Promise<OrderResponse[]> {
    return this.ordersService.getOrdersByUser(req.user.id);
  }

  /** ADMIN: xem toàn bộ đơn hàng */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOkResponse({ type: [OrderResponse] })
  async getAllOrders(): Promise<OrderResponse[]> {
    return this.ordersService.getAllOrders();
  }

  /** ADMIN: xem chi tiết 1 đơn hàng */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  @ApiOkResponse({ type: OrderResponse })
  async getOrder(@Param('id') id: number): Promise<OrderResponse> {
    const order = await this.ordersService.getById(id);
    return order;
  }

  /** ADMIN: cập nhật trạng thái đơn hàng */
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
  @ApiOkResponse({ type: OrderResponse })
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELED',
  ): Promise<OrderResponse> {
    return this.ordersService.setStatus(id, status);
  }
}
