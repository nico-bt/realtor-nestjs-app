import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

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
