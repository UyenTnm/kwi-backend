import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly ordersService: OrdersService) {}

  // Giả lập xử lý thanh toán
  async processPayment(orderId: number, userId?: number) {
    const order = await this.ordersService.findByIdWithUser(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Giả lập thanh toán
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.ordersService.setStatus(orderId, 'PAID');

    return { message: 'Payment successful', orderId, userId };
  }

  // Giả lập webhook callback
  async handleWebhook(orderId: number, status: string) {
    await this.ordersService.setStatus(orderId, status as any);
    return { message: `Webhook processed for order ${orderId}`, status };
  }
}
