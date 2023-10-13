import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
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
