import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { Product } from '../../products/product.entity';
import { ProductAvailability } from 'src/common/enums/product.enums';
// import { ProductAvailability } from '../../products/common/enums/product.enums';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll() {
    return this.inventoryRepo.find({ relations: ['product', 'variant'] });
  }

  async findOne(id: number) {
    const item = await this.inventoryRepo.findOne({
      where: { id },
      relations: ['product', 'variant'],
    });
    if (!item) throw new NotFoundException('Inventory not found');
    return item;
  }

  async create(data: Partial<Inventory>) {
    const item = this.inventoryRepo.create(data);
    return this.inventoryRepo.save(item);
  }

  async update(id: number, data: Partial<Inventory>) {
    const inventory = await this.inventoryRepo.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!inventory) throw new NotFoundException('Inventory not found');

    Object.assign(inventory, data);
    await this.inventoryRepo.save(inventory);

    // cập nhật trạng thái tồn kho cho product
    const product = await this.productRepo.findOne({
      where: { id: inventory.product.id },
    });

    if (product) {
      product.availability =
        inventory.quantity > 0
          ? ProductAvailability.IN_STOCK
          : ProductAvailability.OUT_OF_STOCK;
      await this.productRepo.save(product);
    }

    return { message: 'Inventory updated', inventory };
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.inventoryRepo.remove(item);
    return { message: 'Inventory deleted' };
  }

  async decreaseStock(productId: number, quantity: number) {
    const inventory = await this.inventoryRepo.findOne({
      where: { product: { id: productId } },
      relations: ['product'],
    });
    if (!inventory) throw new NotFoundException('Inventory not found');

    inventory.quantity = Math.max(0, inventory.quantity - quantity);
    await this.inventoryRepo.save(inventory);

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (product) {
      product.availability =
        inventory.quantity > 0
          ? ProductAvailability.IN_STOCK
          : ProductAvailability.OUT_OF_STOCK;
      await this.productRepo.save(product);
    }

    return inventory;
  }
}
