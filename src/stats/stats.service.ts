import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async getStats() {
    const [products, categories] = await Promise.all([
      this.productRepo.count(),
      this.categoryRepo.count(),
    ]);

    // Dummy sales 7 ngày gần nhất để dashboard vẽ chart
    const today = new Date();
    const sales = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return {
        date: d.toISOString().slice(0, 10),
        orders: Math.floor(Math.random() * 10),
        revenue: Math.floor(Math.random() * 2_000_000) + 200_000,
      };
    });

    return {
      products,
      categories,
      orders: 0, // có thể nối Orders sau
      users: 0, // có thể nối Users sau
      sales, // [{date, orders, revenue}]
    };
  }
}
