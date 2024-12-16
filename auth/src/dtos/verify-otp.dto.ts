import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyOTPDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'OTP must be a string of 6 digits.' })
  otp: string;
}