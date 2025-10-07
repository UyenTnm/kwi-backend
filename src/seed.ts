import { AppDataSource } from './data-source';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();

  const productRepo = AppDataSource.getRepository(Product);
  const userRepo = AppDataSource.getRepository(User);

  // Xóa dữ liệu cũ
  await productRepo.clear();
  await userRepo.clear();

  // Thêm sản phẩm mẫu
  const products = [
    {
      name: 'Keyboard A',
      price: 50,
      description: 'Mechanical keyboard',
      image: 'keyboard-a.jpg',
    },
    {
      name: 'Keyboard B',
      price: 70,
      description: 'RGB keyboard',
      image: 'keyboard-b.jpg',
    },
    {
      name: 'Keyboard C',
      price: 90,
      description: 'Wireless keyboard',
      image: 'keyboard-c.jpg',
    },
  ];

  for (const p of products) {
    const product = productRepo.create(p);
    await productRepo.save(product);
  }

  // Thêm user mẫu
  const users = [
    { email: 'admin@example.com', password: await bcrypt.hash('123456', 10) },
    { email: 'user@example.com', password: await bcrypt.hash('123456', 10) },
  ];

  for (const u of users) {
    const user = userRepo.create(u);
    await userRepo.save(user);
  }

  console.log('Seed finished: Products & Users added');
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
