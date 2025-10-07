import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new UnauthorizedException('Email already exists');

    const user = this.userRepo.create({ name, email, password });
    const saved = await this.userRepo.save(user);
    // delete saved.password;

    return {
      message: 'User registered successfully',
      user: saved,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await user.validatePassword(password);
    if (!isValid) throw new UnauthorizedException('Wrong password');

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token: token, user };
  }

  async validateUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user;
  }

  async getProfile(user: any) {
    return { message: 'Profile fetched successfully', user };
  }
}
