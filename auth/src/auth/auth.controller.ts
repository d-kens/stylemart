import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { ForgotPasswordDto } from 'src/dtos/forgot-pwd.dto';
import { ResetPasswordDto } from 'src/dtos/reset-password.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) userData: CreateUserDto) {
    return this.authService.register(userData);
  }

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const decoded = await this.authService.verifyEmail(token);
    return {
      message: 'Email verification successful.',
      data: decoded,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body(ValidationPipe) forgotPwdData: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPwdData.email);
  }

  @Post('reset-password')
  async resetPassword(@Body(ValidationPipe) resetPwdData: ResetPasswordDto) {
    return this.authService.resetPassword(resetPwdData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }
}
