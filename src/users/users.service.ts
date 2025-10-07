import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role as 'user' | 'admin',
    };
  }

  // ====== BỔ SUNG CHO AUTH ======
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Overload signatures:
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
  async create(
    email: string,
    password: string,
    role?: 'user' | 'admin',
  ): Promise<User>;

  // Implementation handling both cases
  async create(
    arg1: CreateUserDto | string,
    arg2?: string,
    arg3?: 'user' | 'admin',
  ): Promise<UserResponseDto | User> {
    // Case A: create(dto)
    if (typeof arg1 !== 'string') {
      const createUserDto = arg1 as CreateUserDto;

      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = this.usersRepository.create({
        email: createUserDto.email,
        password: hashedPassword,
        role: 'user',
      });
      const savedUser = await this.usersRepository.save(newUser);
      return this.toUserResponse(savedUser);
    }

    // Case B: create(email, password, role) — dùng cho AuthService.register()
    const email = arg1 as string;
    const password = arg2 as string;
    const role = (arg3 ?? 'user') as 'user' | 'admin';

    const existed = await this.usersRepository.findOne({ where: { email } });
    if (existed) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hashed, role });
    return this.usersRepository.save(user); // trả về entity để AuthService đọc role
  }
  // ====== HẾT BỔ SUNG CHO AUTH ======

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.toUserResponse(user));
  }

  async findOne(id: string | number): Promise<UserResponseDto> {
    const where = typeof id === 'string' ? { id: Number(id) } : { id };
    const user = await this.usersRepository.findOne({ where });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return this.toUserResponse(user);
  }

  async update(
    id: string | number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const where = typeof id === 'string' ? { id: Number(id) } : { id };
    const user = await this.usersRepository.findOne({ where });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    if (updateUserDto.email) {
      const emailExists = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (emailExists && emailExists.id !== user.id) {
        throw new BadRequestException('Email already exists');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      if (updateUserDto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters');
      }
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role as 'user' | 'admin';
    }

    const updatedUser = await this.usersRepository.save(user);
    return this.toUserResponse(updatedUser);
  }

  async remove(id: string | number): Promise<{ message: string }> {
    const where = typeof id === 'string' ? { id: Number(id) } : { id };
    const user = await this.usersRepository.findOne({ where });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    await this.usersRepository.delete(user.id);
    return { message: `User with id ${id} deleted successfully` };
  }
}
