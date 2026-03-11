import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() name!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @MinLength(8) password!: string;
}

export class LoginDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsString() password!: string;
}

export class RequestOtpDto {
  @IsString() phone!: string;
}

export class VerifyOtpDto {
  @IsString() phone!: string;
  @IsString() code!: string;
}
