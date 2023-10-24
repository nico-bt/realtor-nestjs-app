import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  AuthResponseDto,
  ProdKeyResponseDto,
  SigninDto,
  SignupDto,
} from './dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(body: SignupDto, userType: UserType): Promise<AuthResponseDto> {
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
        user_type: userType,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
    );

    return { token };
  }

  async signin(body: SigninDto): Promise<AuthResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new BadRequestException('Email not registered');
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Wrong password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
    );
    return { token };
  }

  async generateProductKey(
    email: string,
    user_type: UserType,
  ): Promise<ProdKeyResponseDto> {
    const string = `${email}-${user_type}-${process.env.PRODUCT_KEY_SECRET}`;

    const productKey = await bcrypt.hash(string, 10);
    return { productKey };
  }
}
