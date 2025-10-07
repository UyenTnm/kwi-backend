import 'express';
import type { JwtUser } from '../auth/auth.types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUser;
  }
}
