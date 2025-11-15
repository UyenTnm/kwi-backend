import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      name: user.name ?? '',
    };
  }

  async findAll(q?: string): Promise<UserResponseDto[]> {
    const where = q
      ? [{ email: ILike(`%${q}%`) }, { name: ILike(`%${q}%`) }]
      : undefined;

    const users = await this.usersRepository.find({ where });
    return users.map((u) => this.toResponse(u));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.toResponse(user);
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existed = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existed) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      email: dto.email,
      name: dto.name ?? '',
      password: hashedPassword,
      role: dto.role ?? 'user',
      isActive: dto.isActive ?? true,
    });

    const saved = await this.usersRepository.save(user);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    console.log('Incoming update user DTO:', dto);

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email) {
      const existed = await this.usersRepository.findOne({
        where: { email: dto.email },
      });
      if (existed && existed.id !== id)
        throw new BadRequestException('Email already exists');
      user.email = dto.email;
    }

    if (dto.password && dto.password.trim() !== '') {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role) user.role = dto.role;
    if (dto.name !== undefined) user.name = dto.name;

    // Chuẩn hóa xử lý isActive (boolean/string đều ok)
    if (dto.isActive !== undefined) {
      const val = dto.isActive as any;
      user.isActive =
        val === true || val === 'true' || val === 1 || val === '1';
    }

    const updated = await this.usersRepository.save(user);
    return this.toResponse(updated);
  }

  async toggleStatus(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = !user.isActive;
    const updated = await this.usersRepository.save(user);
    return this.toResponse(updated);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
