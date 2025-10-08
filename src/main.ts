import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet: nới lỏng 1 số rule để Swagger & /uploads hoạt động trong dev
  app.use(
    helmet({
      contentSecurityPolicy: false, // tránh CSP chặn Swagger ui & inline styles trong dev
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // cho phép load ảnh /uploads từ FE khác origin
    }),
  );

  // CORS cho admin FE (và shop FE nếu có)
  app.enableCors({
    origin: ['http://localhost:5173'], // thêm các origin khác nếu cần
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // (Tuỳ chọn) tăng limit cho payload text khi đi kèm multipart (multer handle file, cái này handle text)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  // ValidationPipe: bật transform + implicit conversion để ép string -> number/boolean
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }, // QUAN TRỌNG
      forbidNonWhitelisted: true,
    }),
  );

  // Ẩn field nhạy cảm (vd: password) khi trả về
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Prefix API
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('KwiStore API')
    .setDescription('API docs for KwiStore')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
