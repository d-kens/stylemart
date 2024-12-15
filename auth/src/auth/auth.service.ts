import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { NotificationService } from 'src/events/notification/notification.service';
import { EmailVerificationNotification } from 'src/dtos/notification-payload';
import * as process from 'process';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async register(userData: CreateUserDto) {
    const user = await this.userService.create(userData);

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: `${process.env.VERIFICATION_TOKEN_EXPIRATION_MS}ms`,
      },
    );

    console.log('TOKEN: ', token);

    const verificationLink = `${process.env.WEB_DOMAIN}?token=${token}`;

    const emailVerificationData: EmailVerificationNotification = {
      clientEmail: user.email,
      verificationLink,
    };

    await this.notificationService.sendVerificationEmail(emailVerificationData);

    return {
      message:
        'Registration successful. Please check your email for verification.',
    };
  }

  async login(user: Partial<User>, response: Response) {
    try {
      const accessTokenExpiryTime = new Date();
      accessTokenExpiryTime.setTime(accessTokenExpiryTime.getTime() + parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS));

      const refreshTokenExpiryTime = new Date();
      refreshTokenExpiryTime.setTime(refreshTokenExpiryTime.getTime() + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS));

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

      response.cookie('Access-Tokne', acessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        expires: accessTokenExpiryTime,
      });

      response.cookie('Refresh-Token', refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        expires: refreshTokenExpiryTime,
      });

      return { message: 'Authentication Sucessful' }

    } catch (error) {
      this.logger.error("USER AUTHENTICATION FAILED", error);
      throw new InternalServerErrorException('User authentication failed');
    }
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.VERIFICATION_EXPIRES_IN,
      });

      const user = await this.userService.findOneById(decoded.sub);

      if (user.isEmailVerified)
        throw new BadRequestException('User has already been verified');

      await this.userService.update(decoded.sub, { isEmailVerified: true });

      return {
        message: 'Email verification successful.',
      };
    } catch (error) {
      this.logger.error(error);

      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Verification token has expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Invalid verification token');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while verifying the token',
        );
      }
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return null;

    return user;
  }
}
