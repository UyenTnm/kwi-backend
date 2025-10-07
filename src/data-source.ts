import { DataSource } from 'typeorm';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true, // tự động tạo bảng
  logging: false,
  entities: [Product, User],
  migrations: [],
  subscribers: [],
});
