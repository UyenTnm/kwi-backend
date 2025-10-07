import { DataSource } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'kwistore',
  entities: [Category, Product],
  synchronize: true, // chỉ dùng khi seed — không bật trong production
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected!');

  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo = AppDataSource.getRepository(Product);

  // Tạo danh mục
  const categoriesData = [
    {
      name: 'Keyboard Kit',
      slug: 'keyboard-kit',
      description: 'Bộ khung bàn phím custom.',
    },
    {
      name: 'Full Build',
      slug: 'full-build',
      description: 'Bàn phím lắp ráp hoàn chỉnh.',
    },
    {
      name: 'Switch',
      slug: 'switch',
      description: 'Công tắc cơ học cho bàn phím.',
    },
    {
      name: 'Keycap',
      slug: 'keycap',
      description: 'Bộ phím thay thế với nhiều profile.',
    },
    {
      name: 'Accessory',
      slug: 'accessory',
      description: 'Phụ kiện bàn phím cơ.',
    },
  ];

  const categories: Category[] = [];

  for (const data of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { slug: data.slug } });
    if (!cat) {
      cat = categoryRepo.create(data);
      await categoryRepo.save(cat);
      console.log(`Created category: ${data.name}`);
    }
    categories.push(cat);
  }

  // Tạo sản phẩm mẫu
  const productsData = [
    {
      name: 'Keychron Q1 Pro',
      slug: 'keychron-q1-pro',
      price: 4200000,
      stock: 10,
      description:
        'Bàn phím cơ không dây cao cấp, layout 75%, switch Gateron Pro.',
      category: categories[1],
    },
    {
      name: 'Monsgeek M1 Kit',
      slug: 'monsgeek-m1-kit',
      price: 2800000,
      stock: 20,
      description: 'Barebone kit nhôm CNC, hỗ trợ hotswap và gasket mount.',
      category: categories[0],
    },
    {
      name: 'Akko CS Jelly Blue Switch (45pcs)',
      slug: 'akko-cs-jelly-blue',
      price: 390000,
      stock: 50,
      description: 'Switch tactile, cảm giác nhấn nảy nhẹ và rõ ràng.',
      category: categories[2],
    },
    {
      name: 'Keycap Cherry Profile Gray/White',
      slug: 'keycap-cherry-graywhite',
      price: 490000,
      stock: 25,
      description:
        'Bộ keycap PBT double-shot profile Cherry, tông xám trắng cổ điển.',
      category: categories[3],
    },
    {
      name: 'Deskmat Galaxy 900x400mm',
      slug: 'deskmat-galaxy',
      price: 290000,
      stock: 15,
      description:
        'Deskmat dày 4mm, họa tiết dải ngân hà, đế cao su chống trượt.',
      category: categories[4],
    },
  ];

  for (const data of productsData) {
    const existing = await productRepo.findOne({ where: { slug: data.slug } });
    if (!existing) {
      const product = productRepo.create(data);
      await productRepo.save(product);
      console.log(`Created product: ${data.name}`);
    }
  }

  console.log('Seed completed!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed', err);
  AppDataSource.destroy();
});
