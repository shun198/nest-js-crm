import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // ExceptionFilter インターフェースの実装
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message || 'Not Found';

    // レスポンスを加工
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      user: request.user,
      message: message,
    });
  }
}
