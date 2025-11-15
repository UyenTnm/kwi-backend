import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentPost } from './content-post.entity';
import { Product } from '../../products/product.entity';
import { User } from '../../users/user.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ContentPostsService {
  constructor(
    @InjectRepository(ContentPost)
    private readonly postRepo: Repository<ContentPost>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.postRepo.find({
      relations: ['author', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author', 'product'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: any, file?: Express.Multer.File, userId?: number) {
    const post = this.postRepo.create({
      ...data,
      author: userId ? { id: userId } : null,
      thumbnail: file ? file.filename : null,
    });
    return this.postRepo.save(post);
  }

  async update(id: number, data: any, file?: Express.Multer.File) {
    const post = await this.findOne(id);

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const uploadPath = path.join('uploads', fileName);
      fs.writeFileSync(uploadPath, file.buffer);
      data.thumbnail = `/uploads/${fileName}`;
    }

    Object.assign(post, data);
    return this.postRepo.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
    return { message: 'Post deleted successfully' };
  }
}
