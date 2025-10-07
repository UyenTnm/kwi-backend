import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Test Swagger' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'testswagger@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456aA@', minLength: 6 })
  @MinLength(6)
  password: string;
}
