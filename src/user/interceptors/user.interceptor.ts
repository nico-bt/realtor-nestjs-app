import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  NestInterceptor,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ForbiddenException();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      request.user = payload;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }

    return handler.handle();
  }
}
