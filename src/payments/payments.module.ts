import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Payment } from './payment.entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [OrdersModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
