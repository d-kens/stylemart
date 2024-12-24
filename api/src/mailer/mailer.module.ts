import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerService } from './mailer.service';

@Module({
  providers: [MailerService]
})
export class MailerModule {}
