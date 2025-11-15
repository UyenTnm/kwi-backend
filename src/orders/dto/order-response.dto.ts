import { ApiProperty } from '@nestjs/swagger';

export class ProductSummary {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() price: number;
  @ApiProperty({ required: false }) image?: string;
}

export class OrderItemResponse {
  @ApiProperty() id: number;
  @ApiProperty() quantity: number;
  @ApiProperty({ type: () => ProductSummary })
  product: ProductSummary;
}

export class OrderResponse {
  @ApiProperty() id: number;
  @ApiProperty({ enum: ['PENDING', 'PAID', 'FULFILLED', 'CANCELED'] })
  status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELED';
  @ApiProperty() subtotal: number;
  @ApiProperty() shippingFee: number;
  @ApiProperty() total: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty({ type: () => [OrderItemResponse] })
  items: OrderItemResponse[];
}
