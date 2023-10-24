import { UserType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger/dist';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // Reg ex
  @IsOptional()
  @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @ApiProperty({ description: 'To sign up as REALTOR you need a product key' })
  @IsOptional()
  @IsString()
  productKey?: string;
}

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  user_type: UserType;
}

export class AuthResponseDto {
  token: string;
}
export class ProdKeyResponseDto {
  productKey: string;
}

export class MeResponseDto {
  id: number;
  email: string;
  iat: number;
}
