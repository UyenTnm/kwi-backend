import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Thanh toán đơn hàng
  @UseGuards(JwtAuthGuard)
  @Post(':orderId')
  async pay(@Param('orderId') orderId: number, @Req() req) {
    return this.paymentsService.processPayment(orderId, req.user.id);
  }

  // Webhook callback (giả lập)
  @Post('webhook')
  async handleWebhook(@Body() body: { orderId: number; status: string }) {
    return this.paymentsService.handleWebhook(body.orderId, body.status);
  }
}
