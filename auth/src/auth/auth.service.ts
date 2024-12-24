import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from 'src/events/notification/notification.service';
import { PasswordResetNotification } from 'src/dtos/notification-payload';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { TokenService } from 'src/token/token.service';
import { TokenType } from 'src/enums/toke-type.enum';
import { ResetPasswordDto } from 'src/dtos/reset-password.dto';
import { hash } from 'bcrypt';
import { ChangepasswordDto } from 'src/dtos/change-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
  ) {}

  async register(userData: CreateUserDto): Promise<User> {
    return await this.userService.create(userData);
  }

  async login(user: Partial<User>, response: Response) {
    try {
      const accessTokenExpiryTime = new Date();
      accessTokenExpiryTime.setTime(
        accessTokenExpiryTime.getTime() +
          parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS),
      );

      const refreshTokenExpiryTime = new Date();
      refreshTokenExpiryTime.setTime(
        refreshTokenExpiryTime.getTime() +
          parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS),
      );

      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
      };

      const acessToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS}ms`,
      });

      const refreshToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.SECRET_KEY,
        expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS}ms`,
      });

      await this.userService.update(user.id, {
        refreshToken: await bcrypt.hash(refreshToken, 10),
      });

      response.cookie('AccessToken', acessToken, {
        httpOnly: true,
        secure: false,
        expires: accessTokenExpiryTime,
      });

      response.cookie('RefreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        expires: refreshTokenExpiryTime,
      });

      return { message: 'Authentication Sucessful' };
    } catch (error) {
      this.logger.error('USER AUTHENTICATION FAILED', error);
      throw new InternalServerErrorException('User authentication failed');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordResetToken = await this.tokenService.createToken(
      user.id,
      user.email,
      TokenType.PWD_RESET,
    );

    console.log('Password Reset token: ' + passwordResetToken);

    const passwordResetData: PasswordResetNotification = {
      clientEmail: user.email,
      resetLink: `${process.env.WEB_DOMAIN}/auth/reset-password?token=${passwordResetToken}`,
    };

    await this.notificationService.sendPasswordReset(passwordResetData);

    return {
      message: 'Password reset link has been sent to your email.',
    };
  }

  async resetPassword(resetpwdData: ResetPasswordDto) {
    const { token, newPassword } = resetpwdData;
    const user = await this.tokenService.validateToken(token);

    const password = await hash(newPassword, 10);

    console.log('New password: ' + password);

    await this.userService.update(user.id, { password });

    return {
      message: 'Password reset succesful',
    };
  }

  async changePassword(changePwdData: ChangepasswordDto, user: User) {
    const { oldPassword, newPassword } = changePwdData;

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect old password');
    }

    const password = await hash(newPassword, 10);

    await this.userService.update(user.id, { password });

    return {
      message: 'Password changed successfully',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.tokenService.validateToken(token);

    if (user.isEmailVerified)
      throw new BadRequestException('User has already been verified');

    await this.userService.update(user.id, { isEmailVerified: true });

    return {
      message: 'Email verification successful.',
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return null;

    return user;
  }

  async verifyRefreshToken(refreshToken: string, userId: string) {
    const user = await this.userService.findOneById(userId);

    if (!user) return null;

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) return null;

    return user;
  }
}
