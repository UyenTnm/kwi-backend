import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class MockGatewayQueryDto {
  @Type(() => Number)
  @IsInt()
  orderId: number;

  // Optional: chỉ để tránh warning khi chưa dùng
  @IsOptional()
  token?: string;
}
