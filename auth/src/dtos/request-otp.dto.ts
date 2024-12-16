import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestOTPDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
