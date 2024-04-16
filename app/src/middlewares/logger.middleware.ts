import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, session } = request;
    // ログレベル、ハンドラー名、時刻、ログIDを追加したい
    response.on('finish', () => {
      const { statusCode } = response;
      if (session['user']) {
        this.logger.log(
          `${ip} ${method} 社員番号:${session['user'].employee_number} ${originalUrl} ${statusCode}`,
        );
      } else {
        this.logger.log(`${ip} ${method} ${originalUrl} ${statusCode}`);
      }
    });
    next();
  }
}
