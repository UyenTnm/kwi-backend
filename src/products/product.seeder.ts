import { Injectable } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from 'src/common/enums/product.enums';

@Injectable()
export class ProductSeeder {
  constructor(private readonly productsService: ProductsService) {}

  async run() {
    const raw: Array<Partial<CreateProductDto>> = [
      {
        name: 'Neo65',
        description: '60% custom keyboard',
        price: 2222,
        image: undefined,
        video: undefined,
      },
      {
        name: 'KWI X200',
        description: 'TKL keyboard with gasket mount',
        price: 199.9,
        stock: 50,
        currency: 'USD',
        image: undefined,
        video: undefined,
      },
      {
        name: 'Switch Set',
        description: 'Linear switches, 90pcs',
        price: 45,
      },
    ];

    for (const item of raw) {
      const dto: CreateProductDto = {
        name: item.name!,
        price: Number(item.price ?? 0),
        stock: Number(item.stock ?? 0),
        currency: item.currency ?? 'USD',
        description: item.description ?? '',
        slug: item.slug,
        categoryId: item.categoryId,
        brandId: item.brandId,
        typeId: item.typeId,
        subtypeId: item.subtypeId,
        condition: item.condition,
        availability: item.availability,
        status: item.status ?? ProductStatus.INACTIVE,
        image: item.image,
        video: item.video,
        attributes: item.attributes,
      };

      await this.productsService.create(dto);
    }
  }
}
