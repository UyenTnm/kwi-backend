export interface JwtUser {
  userId: number;
  email: string;
  role: 'user' | 'admin';
}
