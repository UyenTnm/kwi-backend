import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Lấy giỏ hàng hiện tại
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getCart(@Request() req) {
    const userId = req.user?.id ?? req.user?.userId;
    return this.cartService.getCart(userId);
  }

  // Thêm vào giỏ
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('add')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
        quantity: { type: 'number', default: 1 },
      },
      required: ['productId'],
    },
  })
  async addToCart(
    @Request() req,
    @Body() body: { productId: number; quantity?: number },
  ) {
    const userId = req.user?.id ?? req.user?.userId;
    if (!userId) throw new BadRequestException('User not found in request');

    return this.cartService.addToCart(
      userId,
      body.productId,
      body.quantity ?? 1,
    );
  }

  // Cập nhật số lượng (PATCH /cart/:id)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { quantity: { type: 'number' } },
      required: ['quantity'],
    },
  })
  async updateQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(id, quantity);
  }

  // Xóa 1 item
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }

  // Checkout
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('checkout')
  async checkout(@Request() req) {
    const userId = req.user?.id ?? req.user?.userId;
    return this.cartService.checkout(userId);
  }
}
