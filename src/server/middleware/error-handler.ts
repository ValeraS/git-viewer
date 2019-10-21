import { Request, Response, NextFunction } from 'express';

export type ErrorWithStatus = Error & { status?: number };

export function errorHandler() {
  return function(
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.status(err.status || 500);

    if (process.env.NODE_ENV === 'production') {
      res.json({});
    } else {
      res.json({
        errors: {
          message: err.message,
          stack: err.stack,
        },
      });
    }
  };
}
