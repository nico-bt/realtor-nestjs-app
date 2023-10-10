import { Injectable, ConflictException } from '@nestjs/common';
import { SignupDto } from './dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(body: SignupDto) {
    const alreadyRegistered = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (alreadyRegistered) {
      throw new ConflictException('Mail already registered');
    }

    const hashPassword = await bcrypt.hash(body.password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashPassword,
        user_type: UserType.BUYER,
      },
    });

    delete newUser.password;

    return newUser;
  }

  signin() {
    return 'Logged in';
  }
}
