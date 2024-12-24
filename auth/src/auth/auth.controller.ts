import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { ChangepasswordDto } from 'src/dtos/change-password.dto';
import { UserReponseDto } from 'src/dtos/user-reponse.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) userData: CreateUserDto,
  ): Promise<UserReponseDto> {
    const result = await this.authService.register(userData);
    return new UserReponseDto(result);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getCurrentUser(@CurrentUser() user: User): Promise<UserReponseDto> {
    console.log('User: ' + JSON.stringify(user));
    return new UserReponseDto(user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
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

  @UseGuards(JwtRefreshAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body(ValidationPipe) changePwdData: ChangepasswordDto,
    @CurrentUser() user: User,
  ) {
    return await this.authService.changePassword(changePwdData, user);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('AccessToken');
    response.clearCookie('RefreshToken');

    return {
      message: 'Logged out successfully.',
    };
  }
}
