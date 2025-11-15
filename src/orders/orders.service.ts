import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CartItem } from '../cart/cart-item.entity';
import { User } from '../users/user.entity';
import { OrderResponse } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  async createOrderFromCart(user: User): Promise<OrderResponse> {
    const cartItems = await this.cartRepo.find({
      where: { user: { id: user.id }, checkedOut: false },
      relations: ['product'],
    });

    if (cartItems.length === 0)
      throw new BadRequestException('Your cart is empty.');

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const shippingFee = 0;
    const total = subtotal + shippingFee;

    const order = this.orderRepo.create({
      user,
      items: cartItems,
      subtotal,
      shippingFee,
      total,
      status: 'PENDING',
    });

    cartItems.forEach((item) => (item.checkedOut = true));
    await this.cartRepo.save(cartItems);

    const saved = await this.orderRepo.save(order);
    return this.toResponse(saved);
  }

  async getOrdersByUser(userId: number): Promise<OrderResponse[]> {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
    return orders.map((o) => this.toResponse(o));
  }

  async getById(id: number): Promise<OrderResponse> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.toResponse(order);
  }

  async setStatus(
    orderId: number,
    status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELED',
  ): Promise<OrderResponse> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    const saved = await this.orderRepo.save(order);
    return this.toResponse(saved);
  }

  async getAllOrders(): Promise<OrderResponse[]> {
    const orders = await this.orderRepo.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
    return orders.map((o) => this.toResponse(o));
  }

  async findByIdWithUser(orderId: number): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['user'],
    });
  }

  private toResponse(order: Order): OrderResponse {
    return {
      id: order.id,
      status: order.status as OrderResponse['status'],
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      total: order.total,
      createdAt: order.createdAt ? new Date(order.createdAt) : new Date(), // Fix type mismatch
      items:
        order.items?.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: (item.product as any)?.image ?? null,
          },
        })) ?? [],
    };
  }
}
