import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const started = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - started;
      const { statusCode } = res;

      console.log(
        `[API] ${method} ${originalUrl} -> ${statusCode} (${durationMs} ms)`,
      );
    });

    next();
  }
}
