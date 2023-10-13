import { Image } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateHomeDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  number_of_bedrooms: number;
  @IsNotEmpty()
  number_of_bathrooms: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsPositive()
  land_size: number;

  @IsOptional()
  images?: Image[];
}
