import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'alice@example.com' })
  email: string;

  role: 'user' | 'admin';
}
