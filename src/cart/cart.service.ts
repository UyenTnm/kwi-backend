import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Lấy giỏ hàng (chỉ các item chưa checkout)
  async getCart(userId: number): Promise<CartItem[]> {
    return this.cartRepo.find({
      where: { user: { id: userId }, checkedOut: false },
      relations: ['product', 'product.images'], // nếu muốn include thêm quan hệ
    });
  }

  // Thêm sản phẩm vào giỏ (nếu có rồi thì cộng dồn quantity)
  async addToCart(
    userId: number,
    productId: number,
    quantity = 1,
  ): Promise<CartItem> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Tìm item chưa checkout cùng user + product
    const existing = await this.cartRepo.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
        checkedOut: false,
      },
      relations: ['user', 'product'],
    });

    if (existing) {
      existing.quantity = (existing.quantity || 0) + quantity;
      return this.cartRepo.save(existing);
    }

    const newItem = this.cartRepo.create({
      user,
      product,
      quantity,
      checkedOut: false,
    } as Partial<CartItem>);

    return this.cartRepo.save(newItem);
  }

  // Cập nhật số lượng (nếu quantity <= 0 thì xóa item)
  async updateQuantity(itemId: number, quantity: number) {
    const item = await this.cartRepo.findOne({
      where: { id: itemId },
      relations: ['product', 'user'],
    });
    if (!item) throw new NotFoundException('Item not found');

    if (quantity <= 0) {
      await this.cartRepo.remove(item);
      return { removed: true };
    }

    item.quantity = quantity;
    return this.cartRepo.save(item);
  }

  // Xóa item khỏi giỏ
  async remove(itemId: number) {
    const res = await this.cartRepo.delete(itemId);
    return { affected: res.affected ?? 0 };
  }

  // Checkout: đánh dấu checkedOut = true (ở project thực tế bạn có thể tạo Order ở đây)
  async checkout(userId: number) {
    const items = await this.cartRepo.find({
      where: { user: { id: userId }, checkedOut: false },
      relations: ['product'],
    });

    if (!items || items.length === 0)
      throw new NotFoundException('Cart is empty');

    for (const it of items) {
      it.checkedOut = true;
      await this.cartRepo.save(it);
    }

    // TODO: Ở đây  có thể tạo order (OrderService) và chuyển các item vào order
    return { message: 'Checked out success', count: items.length };
  }
}
