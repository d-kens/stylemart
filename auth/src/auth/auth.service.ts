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
        secret: process.env.JWT_SECRET,
        expiresIn: `${process.env.JWT_EXPIRES_IN}s`,
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

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findOneById(decoded.sub);

      if (user.isEmailVerified) throw new BadRequestException('User has already been verified')

      await this.userService.update(decoded.sub, { isEmailVerified: true})


      return {
        message:
          'Email verification successful.',
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
}
