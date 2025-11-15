import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ProductStatus,
  ProductAvailability,
  ProductCondition,
  GroupbuyType,
} from 'src/common/enums/product.enums';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { Brand } from '../brands/brands.entity';
import { slugify } from 'transliteration';
import { ProductImage } from './product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  /** Get all products */
  async findAll(): Promise<Product[]> {
    return this.productRepo.find({
      relations: [
        'category',
        'brand',
        'type',
        'subtype',
        'promotion',
        'images',
      ],
      order: { id: 'DESC' },
    });
  }

  /** Get single product */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'category',
        'brand',
        'type',
        'subtype',
        'promotion',
        'images',
        'variants',
      ],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  /** Generate unique slug */
  private async buildUniqueSlug(name?: string, inputSlug?: string) {
    const base =
      (inputSlug && inputSlug.trim()) ||
      (name ? slugify(name, { lowercase: true }) : '');
    let slug = base || `product-${Date.now()}`;
    let i = 1;
    while (await this.productRepo.findOne({ where: { slug } })) {
      slug = base ? `${base}-${i++}` : `product-${Date.now()}-${i++}`;
    }
    return slug;
  }

  /** CREATE product */
  async create(dto: CreateProductDto & { image?: string; video?: string }) {
    try {
      const slug = await this.buildUniqueSlug(dto.name, dto.slug);

      // Normalize status
      const isActive =
        [true, 'true', 1, '1'].includes(dto.isActive as any) ||
        dto.status === ProductStatus.ACTIVE;

      const product = this.productRepo.create({
        name: dto.name,
        slug,
        description: dto.description ?? undefined,
        /** Save WYSIWYG detail */
        detail: dto.detail ?? undefined,
        price: Number(dto.price ?? 0),
        stock: Number(dto.stock ?? 0),
        currency: dto.currency ?? 'USD',
        image: dto.image ?? undefined,
        video: dto.video ?? undefined,
        groupbuyType: dto.groupbuyType ?? GroupbuyType.NORMAL,
        condition: dto.condition ?? ProductCondition.NEW,
        availability: dto.availability ?? ProductAvailability.IN_STOCK,
        status: isActive ? ProductStatus.ACTIVE : ProductStatus.INACTIVE,
        brand: dto.brandId ? ({ id: Number(dto.brandId) } as Brand) : null,
        category: dto.categoryId
          ? ({ id: Number(dto.categoryId) } as Category)
          : null,
      });

      const saved = await this.productRepo.save(product);
      return this.findOne(saved.id);
    } catch (err) {
      console.error('Error creating product:', err);
      throw new BadRequestException('Failed to create product');
    }
  }

  /** UPDATE product */
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');

    // Basic fields
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.detail !== undefined) product.detail = dto.detail ?? product.detail;
    if (dto.price !== undefined) product.price = Number(dto.price);
    if (dto.stock !== undefined) product.stock = Number(dto.stock);
    if (dto.currency !== undefined) product.currency = dto.currency;

    // Media
    if (dto.image !== undefined) product.image = dto.image;
    if (dto.video !== undefined) product.video = dto.video;

    // Relations
    if (dto.brandId !== undefined)
      product.brand = dto.brandId ? ({ id: Number(dto.brandId) } as any) : null;
    if (dto.categoryId !== undefined)
      product.category = dto.categoryId
        ? ({ id: Number(dto.categoryId) } as any)
        : null;

    // Preorder logic
    if (dto.isPreorder !== undefined) product.isPreorder = dto.isPreorder;
    if (dto.groupbuyType !== undefined) product.groupbuyType = dto.groupbuyType;

    if (dto.preorderDeadline !== undefined)
      product.preorderDeadline = dto.preorderDeadline ?? null;
    if (dto.estimatedDelivery !== undefined)
      product.estimatedDelivery = dto.estimatedDelivery ?? null;

    // Re-evaluate availability
    if (product.groupbuyType === GroupbuyType.PREORDER) {
      product.availability = ProductAvailability.PREORDER;
    } else if (product.stock > 0) {
      product.availability = ProductAvailability.IN_STOCK;
    } else {
      product.availability = ProductAvailability.OUT_OF_STOCK;
    }

    // Save safely
    const saved = await this.productRepo.save(product);
    return this.findOne(saved.id);
  }

  /** DELETE */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }

  /** TOGGLE ACTIVE STATUS */
  async toggleStatus(id: number): Promise<Product> {
    const product = await this.findOne(id);
    product.status =
      product.status === ProductStatus.ACTIVE
        ? ProductStatus.INACTIVE
        : ProductStatus.ACTIVE;
    await this.productRepo.save(product);
    return this.findOne(id);
  }

  /** ADD GALLERY IMAGES */
  async addGallery(id: number, files: Express.Multer.File[]) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');

    const imageRepo = this.productRepo.manager.getRepository(ProductImage);
    const images = files.map((file) => {
      const img = new ProductImage();
      img.productId = id;
      img.url = `/uploads/products/${file.filename}`;
      return img;
    });

    await imageRepo.save(images);
    return { success: true, count: images.length };
  }
}
