import { Request, Response, NextFunction } from 'express';
import { ErrorWithStatus } from './error-handler';

export function notFoundHandler() {
  // Catch 404 and forward to error handler
  return function(req: Request, res: Response, next: NextFunction) {
    const err: ErrorWithStatus = new Error('Not Found');
    err['status'] = 404;
    next(err);
  };
}
