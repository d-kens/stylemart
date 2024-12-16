import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { VerifyOTPDto } from 'src/dtos/verify-otp.dto';
import { RequestOTPDto } from 'src/dtos/request-otp.dto';

@Controller()
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('requestOtp')
  async requestOTP(
    @Body(ValidationPipe) requestOtpDto: RequestOTPDto,
  ): Promise<void> {
    const { userId, email } = requestOtpDto;
    return await this.otpService.requestOTP(userId, email);
  }

  @Post('verifyOtp')
  async verifyOTP(@Body(ValidationPipe) verifyOTPDto: VerifyOTPDto) {
    const { userId, otp } = verifyOTPDto;
    return await this.otpService.verifyOTP(userId, otp);
  }

  @Delete('revokeOtp/:userId')
  async revokeOTP(@Param('userId') userId: string) {
    return await this.otpService.revokeOTP(userId);
  }
}
