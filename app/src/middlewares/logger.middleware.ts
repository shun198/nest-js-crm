import { Injectable, NestMiddleware, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { sendSlackNotification } from 'src/common/slack';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, session } = request;
    // ログレベル、ハンドラー名、時刻、ログIDを追加したい
    response.on('finish', () => {
      const { statusCode } = response;
      let message = '';
      if (session['user']) {
        message = `${ip} 社員番号:${session['user'].employee_number} ${method} ${originalUrl} ${statusCode}`;
      } else {
        message = `${ip} 未ログイン ${method} ${originalUrl} ${statusCode}`;
      }
      if (statusCode < HttpStatus.BAD_REQUEST) {
        this.logger.log(message);
      } else if (
        statusCode >= HttpStatus.BAD_REQUEST &&
        statusCode < HttpStatus.INTERNAL_SERVER_ERROR
      ) {
        this.logger.warn(message);
      } else {
        this.logger.error(message);
        sendSlackNotification(message);
      }
    });
    next();
  }
}
