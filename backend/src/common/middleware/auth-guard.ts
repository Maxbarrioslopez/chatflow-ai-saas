import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AppError } from '../errors';

export interface AuthRequest extends Request {
  userId?: string;
  organizationId?: string;
  userRole?: string;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      organizationId: string;
      role: string;
    };
    req.userId = decoded.userId;
    req.organizationId = decoded.organizationId;
    req.userRole = decoded.role;
    next();
  } catch {
    return next(new AppError(401, 'Invalid or expired token'));
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }
    next();
  };
}
