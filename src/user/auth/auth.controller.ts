import {
  Body,
  Controller,
  Param,
  Post,
  ParseEnumPipe,
  UnauthorizedException,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  GenerateProductKeyDto,
  MeResponseDto,
  SigninDto,
  SignupDto,
} from './dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User, UserInfoJwt } from '../decorators/user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: `userType values are: ${UserType.BUYER} and ${UserType.REALTOR}. To Signup as REALTOR you need a product key provided by an admin`,
  })
  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ): Promise<AuthResponseDto> {
    if (userType !== UserType.BUYER) {
      // To sign up as REALTOR you need a product key
      if (!body.productKey) {
        throw new UnauthorizedException('Product key required');
      }
      const userProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProdKey = await bcrypt.compare(
        userProductKey,
        body.productKey,
      );

      if (!isValidProdKey) {
        throw new UnauthorizedException('Product key not valid');
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  @HttpCode(200)
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('/key')
  generateProductKey(@Body() { email, user_type }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, user_type);
  }

  @Get('/me')
  me(@User() user: UserInfoJwt): MeResponseDto {
    return user;
  }
}
