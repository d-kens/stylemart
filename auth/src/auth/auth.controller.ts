import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

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

  @UseGuards(LocalAuthGuard)
  @Post('login') 
  async login(@Request() req) {
    return req.user;
  }
}
