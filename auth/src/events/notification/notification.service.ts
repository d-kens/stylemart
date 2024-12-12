import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { microserviceConfig } from 'src/kafka-config';
import {
  EmailVerificationNotification,
  OtpNotification,
  PasswordResetNotification,
} from '../../dtos/notification-payload';
import { EventType } from '../enums/event.enum';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  @Client(microserviceConfig)
  kafkaClient: ClientKafka;

  async onModuleInit(): Promise<void> {
    try {
      await this.kafkaClient.connect();
      this.logger.log('Kafka client connected successfully');
    } catch (error) {
      this.logger.error('Error connecting Kafka client', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  async sendNotification(pattern: string, data: any): Promise<Observable<any>> {
    this.logger.log('Publishing Kafka event');
    this.logger.log('Data: ', data);
    return this.kafkaClient.emit(pattern, data);
  }

  async sendVerificationEmail(
    data: EmailVerificationNotification,
  ): Promise<void> {
    try {
      await this.sendNotification(
        EventType.EMAIL_VERIFICATION_NOTIFICATION,
        data,
      );
    } catch (error) {
      this.logger.error(
        'Error sending verification email notification',
        error.stack,
      );
      throw error;
    }
  }

  async sendOtpNotification(data: OtpNotification): Promise<void> {
    try {
      await this.sendNotification(EventType.OTP_NOTIFICATION, data);
    } catch (error) {
      this.logger.error('Error sending OTP notification', error.stack);
      throw error;
    }
  }

  async sendPasswordReset(data: PasswordResetNotification): Promise<void> {
    try {
      await this.sendNotification(EventType.PASSWORD_RESET_NOTIFICATION, data);
    } catch (error) {
      this.logger.error(
        'Error sending password reset email notification',
        error.stack,
      );
      throw error;
    }
  }
}
