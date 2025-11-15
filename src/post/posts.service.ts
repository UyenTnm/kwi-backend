import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './post.entity';
import { Product } from '../products/product.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll() {
    return this.postRepo.find({
      where: { published: true },
      relations: ['products', 'category', 'author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['products', 'category', 'author'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.postRepo.findOne({
      where: { slug },
      relations: ['products', 'category', 'author'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  // Helper: validate và lấy Product entities từ danh sách ID
  private async productsFromIds(productIds?: number[]): Promise<Product[]> {
    if (!productIds?.length) return [];

    const uniqueIds = [...new Set(productIds.map(Number))].filter(Boolean);
    const found = await this.productRepo.find({ where: { id: In(uniqueIds) } });

    if (found.length !== uniqueIds.length) {
      const foundIds = new Set(found.map((p) => p.id));
      const missing = uniqueIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(
        `Invalid productIds: ${missing.join(', ')}`,
      );
    }
    return found;
  }

  // CREATE POST
  async create(dto: CreatePostDto) {
    const products = await this.productsFromIds(dto.productIds);

    // Ép kiểu rõ ràng Partial<Post> để tránh lỗi TS2769
    const post = this.postRepo.create({
      title: dto.title,
      slug: dto.slug,
      subtitle: dto.subtitle ?? null,
      summary: dto.summary ?? null,
      content: dto.content,
      coverImage: dto.coverImage ?? undefined,
      published: dto.published ?? false,
      publishedAt: dto.published
        ? dto.publishedAt
          ? new Date(dto.publishedAt)
          : new Date()
        : null,
      products,
    } as Partial<Post>);

    // Save trả về Post hoặc Post[], nên ép kiểu cụ thể
    const saved = (await this.postRepo.save(post)) as Post;
    return this.findById(saved.id);
  }

  // UPDATE POST
  async update(id: number, dto: UpdatePostDto) {
    const post = await this.findById(id);

    if (dto.title !== undefined) post.title = dto.title;
    if (dto.slug !== undefined) post.slug = dto.slug;
    if (dto.subtitle !== undefined) post.subtitle = dto.subtitle;
    if (dto.summary !== undefined) post.summary = dto.summary;
    if (dto.content !== undefined) post.content = dto.content;
    if (dto.coverImage !== undefined) post.coverImage = dto.coverImage;

    if (dto.published !== undefined) {
      post.published = dto.published;
      post.publishedAt = dto.published
        ? dto.publishedAt
          ? new Date(dto.publishedAt)
          : (post.publishedAt ?? new Date())
        : null;
    } else if (dto.publishedAt !== undefined) {
      post.publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
    }

    if (dto.productIds !== undefined) {
      post.products = await this.productsFromIds(dto.productIds);
    }

    const saved = (await this.postRepo.save(post)) as Post;
    return this.findById(saved.id);
  }

  // DELETE POST
  async remove(id: number) {
    const post = await this.findById(id);
    await this.postRepo.remove(post);
    return { success: true };
  }

  // TOGGLE PUBLISH STATUS
  async togglePublish(id: number) {
    const post = await this.findById(id);
    post.published = !post.published;
    post.publishedAt = post.published ? (post.publishedAt ?? new Date()) : null;
    await this.postRepo.save(post);
    return this.findById(id);
  }
}
