import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'testswagger@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456aA@' })
  @IsString()
  password: string;
}
