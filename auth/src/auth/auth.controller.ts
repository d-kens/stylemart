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
  async login(
    @CurrentUser() user: Partial<User>,
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
