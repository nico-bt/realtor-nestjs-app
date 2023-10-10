import { Injectable, ConflictException } from '@nestjs/common';
import { SignupDto } from './dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

    return { alreadyRegistered };
  }

  signin() {
    return 'Logged in';
  }
}
