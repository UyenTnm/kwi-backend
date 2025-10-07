import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Alice_Tr', description: 'Unique username' })
  username: string;

  @ApiProperty({
    example: 'testswagger@example.com',
    description: 'Unique email of the user',
  })
  @IsEmail({}, { message: 'Invalid Email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  // @IsString({ message: 'Password can not be blank' })
  @ApiProperty({
    example: '123456aA@',
    description: 'Password must be at least 6 characters',
  })
  @MinLength(6, { message: 'Password must be least 6 characters' })
  @IsNotEmpty({ message: 'Password can not be blank' })
  password: string;
}
