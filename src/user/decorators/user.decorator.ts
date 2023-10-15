import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfoJwt {
  id: number;
  mail: string;
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  return request.user;
});
