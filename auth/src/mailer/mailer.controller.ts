import { Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from 'src/dtos/send-email.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}
}

