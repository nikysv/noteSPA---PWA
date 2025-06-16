import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';

interface RequestWithUser extends ExpressRequest {
  user?: {
    id: number;
    email: string;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithUser>();

    console.error('Exception caught:', {
      exception,
      path: request.url,
      body: request.body,
      headers: request.headers,
      user: request.user,
    });

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    } else {
      console.error('Unexpected error:', exception);
      response.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Internal server error',
      });
    }
  }
}
