// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'supersecret',
    });
  }

  async validate(payload: any) {
    // payload chứa dữ liệu sign trong login
    // const user = await this.authService.validateUser(payload.id);
    const user = await this.authService.validateUser(payload.id);

    if (!user) throw new UnauthorizedException('Invalid token user');
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
