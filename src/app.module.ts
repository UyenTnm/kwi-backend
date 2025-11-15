import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { extname, join, join as pathJoin } from 'path';

import { ConfigModule } from '@nestjs/config';

// Feature modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { StatsModule } from './stats/stats.module';
import { BrandsModule } from './brands/brands.module';
import { TypesModule } from './types/types.module';

// Entities
import { Product } from './products/product.entity';
import { ProductType } from './types/product-type.entity';
import { ProductSubtype } from './types/product-subtype.entity';
import { Category } from './categories/category.entity';
import { Brand } from './brands/brands.entity';
import { Inventory } from './entities/inventory/inventory.entity';
import { Promotion } from './entities/promotions/promotion.entity';
import { ContentPost } from './entities/content-post/content-post.entity';
import { KeyboardLayout } from './entities/keyboards/keyboard-layout.entity';
import { KeyboardModel } from './entities/keyboards/keyboard-model.entity';
import { InventoryModule } from './entities/inventory/inventory.module';
import { PromotionsModule } from './entities/promotions/promotions.module';
import { ContentPostsModule } from './entities/content-post/content-posts.module';
import { KeyboardModule } from './entities/keyboards/keyboard.module';
import { PostInteractionsModule } from './entities/post-interactions/post-interactions.module';
import { ContentCategory } from './entities/content-post/content-category.entity';
import { ContentCategoryModule } from './entities/content-post/content-category.module';
import { diskStorage } from 'multer';
import { PostsModule } from './post/posts.module';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';
import { MediaModule } from './media/media.module';
import { ProductMedia } from './media/product-media.entity';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM Configuration
    TypeOrmModule.forRoot({
      type:
        (process.env.DB_TYPE as 'mysql' | 'mariadb' | 'postgres' | 'sqlite') ||
        'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3307', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'kwistore2022',
      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
    }),

    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = pathJoin(process.cwd(), 'uploads', 'products');
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const original = file.originalname || 'file';
          const safe = original
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9\-_.]/g, '');
          const ext = extname(original) || '';
          cb(null, `${timestamp}-${random}-${safe}${ext}`);
        },
      }),
    }),

    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    StatsModule,
    BrandsModule,
    TypesModule,
    InventoryModule,
    PromotionsModule,
    ContentPostsModule,
    KeyboardModule,
    PostInteractionsModule,
    ContentCategoryModule,
    TypesModule,
    StatsModule,
    PostsModule,
    UploadModule,
    HealthModule,
    MediaModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    // Register entities globally (optional)
    TypeOrmModule.forFeature([
      Product,
      ProductType,
      ProductSubtype,
      Category,
      Brand,
      Inventory,
      Promotion,
      ContentPost,
      KeyboardLayout,
      KeyboardModel,
      ContentCategory,
      ProductMedia,
    ]),
  ],
  controllers: [UploadController],
})
export class AppModule {}
