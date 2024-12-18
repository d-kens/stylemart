import { Controller, Logger } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventType } from 'src/enums/event.enum';
import {
  EmailVerificationNotification,
  PasswordResetNotification,
} from 'src/dtos/notification-payload';

@Controller('mailer')
export class MailerController {
  private readonly logger = new Logger(MailerController.name);

  constructor(private readonly mailerService: MailerService) {}

  @EventPattern(EventType.EMAIL_VERIFICATION_NOTIFICATION)
  async sendVerificationEmail(@Payload() data: EmailVerificationNotification) {
    this.logger.log(
      `Received email verification notification for ${data.clientEmail}`,
    );
    await this.mailerService.sendVerificationEmail(
      data.clientEmail,
      data.verificationLink,
    );
  }

  @EventPattern(EventType.PASSWORD_RESET_NOTIFICATION)
  async sendPasswordResetEmail(@Payload() data: PasswordResetNotification) {
    this.logger.log(
      `Received password reset notification for ${data.clientEmail}`,
    );

    await this.mailerService.sendPasswordResetEmail(
      data.clientEmail,
      data.resetLink,
    );
  }
}
