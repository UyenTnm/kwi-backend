import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CartItem } from '../cart/cart-item.entity';
import { User } from '../users/user.entity';
// import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  // Tạo đơn hàng từ giỏ hàng (checkout)
  async createOrderFromCart(user: User): Promise<Order> {
    const cartItems = await this.cartRepo.find({
      where: { user: { id: user.id }, checkedOut: false },
      relations: ['product'],
    });

    if (cartItems.length === 0) throw new NotFoundException('Cart is empty!');

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const shippingFee = 0; // bạn có thể thay đổi logic sau
    const total = subtotal + shippingFee;

    const order = this.orderRepo.create({
      user,
      items: cartItems,
      subtotal,
      shippingFee,
      total,
      status: 'PENDING',
    });

    // Cập nhật trạng thái giỏ hàng → checkedOut
    cartItems.forEach((item) => (item.checkedOut = true));
    await this.cartRepo.save(cartItems);

    return await this.orderRepo.save(order);
  }

  // Lấy tất cả đơn hàng của 1 user
  async getOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Lấy chi tiết order (admin hoặc chủ đơn)
  async getById(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  // Admin cập nhật trạng thái đơn hàng
  async setStatus(
    orderId: number,
    status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELED',
  ) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepo.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Hỗ trợ payment gọi lại
  async findByIdWithUser(orderId: number): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['user'],
    });
  }
}
