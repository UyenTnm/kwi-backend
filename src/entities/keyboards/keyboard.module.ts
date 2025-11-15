import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyboardService } from './keyboard.service';
import { KeyboardController } from './keyboard.controller';
import { KeyboardLayout } from './keyboard-layout.entity';
import { KeyboardModel } from './keyboard-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KeyboardLayout, KeyboardModel])],
  providers: [KeyboardService],
  controllers: [KeyboardController],
  exports: [KeyboardService, TypeOrmModule],
})
export class KeyboardModule {}
