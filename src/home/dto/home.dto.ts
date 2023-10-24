import { Message, PrismaPromise, PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  number_of_bedrooms: number;

  @IsOptional()
  number_of_bathrooms: number;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsPositive()
  land_size: number;
}

export class InquireDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class ImageDtoInHome {
  url: string;
}

export class HomeResponseDto {
  id: number;
  address: string;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  city: string;
  listed_date: Date;
  price: number;
  land_size: number;

  @ApiProperty({ enum: [PropertyType.CONDO, PropertyType.RESIDENTIAL] })
  propertyType: PropertyType;

  user: { email: string; name: string };

  // Add ApiProperty decorator to avoid circular dep error from swagger
  @ApiProperty({ type: ImageDtoInHome, isArray: true })
  images: {
    url: string;
  }[];
}

export class MessageResponseDto {
  id: number;
  message: string;
  realtor_id: number;
  buyer_id: number;
  home_id: number;
}

export class MessagesByHomeResponseDto {
  home: {
    id: number;
    address: string;
  };
  message: string;
  buyer: {
    name: string;
    phone: string;
    email: string;
  };
}
