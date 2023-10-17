import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface payloadJwtType {
  id: number;
  email: string;
  iat: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // 1) Determine the userTypes that can access the endpoint
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(roles);

    if (!roles || roles.length === 0) {
      // No need of authorization if no roles are provided in the Roles decorator. Access granted
      return true;
    }
    // 2) Grab JWT from request and verify it
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as payloadJwtType;

      // 3) Get user from db
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });
      if (!user) {
        return false;
      }

      // 4) See if has permission
      if (roles.includes(user.user_type)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
