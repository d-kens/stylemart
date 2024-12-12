import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) userData: CreateUserDto) {
    return this.authService.register(userData);
  }

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    const decoded = await this.authService.verifyEmail(token);
    return {
      message: 'Email verification successful.',
      data: decoded,
    };
  }
}
