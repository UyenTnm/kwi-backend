import { Exclude, Expose } from 'class-transformer';

@Exclude() // mặc định ẩn tất cả
export class ProductVariantResponse {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() colorHex?: string | null;
  @Expose() image?: string | null;
  @Expose() slug?: string | null;
  @Expose() salePrice: number;
  @Expose() stock: number;
  @Expose() isActive: boolean;
}
