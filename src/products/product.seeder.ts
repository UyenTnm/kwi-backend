import { ProductsService } from './products.service';

export class ProductSeeder {
  static async seed(productsService: ProductsService) {
    const products = [
      {
        name: 'Keyboard A',
        description: 'Mechanical keyboard',
        price: 50,
        image: undefined,
      },
      {
        name: 'Mouse B',
        description: 'RGB mouse',
        price: 30,
        image: undefined,
      },
    ];

    for (const p of products) {
      await productsService.create(p);
    }
  }
}
