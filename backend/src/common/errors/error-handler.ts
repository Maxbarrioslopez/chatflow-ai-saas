import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation error',
        statusCode: 400,
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: { message: 'Resource already exists', statusCode: 409 },
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: { message: 'Resource not found', statusCode: 404 },
      });
    }
    return res.status(400).json({
      error: { message: 'Database error', statusCode: 400 },
    });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      error: { message: 'Invalid JSON in request body', statusCode: 400 },
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  });
}
