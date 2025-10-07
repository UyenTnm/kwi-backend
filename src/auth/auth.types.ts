export type Role = 'user' | 'admin';

export interface JwtUser {
  userId: number; // hoặc id
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
