import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'), // SMTP host
      port: this.configService.get<number>('MAIL_PORT'), // SMTP port
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, pwdResetUrl: string): Promise<void> {
    const mailOptions: Mail.Options = {
      from: {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_EMAIL_FROM'),
      },
      to,
      subject: 'Reset Password',
      html: `
                <h1>Reset Password</h1>
                <p>We received a request to reset your password. Click the link below to proceed with password reset:</p>
                <a href="${pwdResetUrl}">Reset Password</a>
            `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(
    to: string,
    verificationUrl: string,
  ): Promise<void> {
    const mailOptions: Mail.Options = {
      from: {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_EMAIL_FROM'),
      },
      to,
      subject: 'Email Verification',
      html: `
                <h1>Verify Your Email</h1>
                <p>Thank you for registering! Please verify your email by clicking the link below:</p>
                <a href="${verificationUrl}">Verify Email</a>
            `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
