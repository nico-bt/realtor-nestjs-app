import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
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
}
