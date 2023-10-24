import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfoJwt {
  id: number;
  email: string;
  iat: number;
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  return request.user;
});
