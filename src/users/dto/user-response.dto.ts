import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'user1@example.com' })
  email: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin'] })
  role: 'user' | 'admin' | 'staff';

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;
}
