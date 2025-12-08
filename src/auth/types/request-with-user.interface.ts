import type { Request } from 'express';
import { User } from '../../database/database-schema';

export interface RequestWithUser extends Request {
  user: User;
}
