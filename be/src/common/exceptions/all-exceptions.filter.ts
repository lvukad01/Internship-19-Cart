import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    let message = exception.message || 'Internal server error';

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const resMsg = (exceptionResponse as any).message;
      message = Array.isArray(resMsg) ? resMsg[0] : resMsg || message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      data: null, 
    });
  }
}