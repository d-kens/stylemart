import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { NotificationService } from 'src/events/notification/notification.service';
import { OTP } from 'src/entities/otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  providers: [OtpService, NotificationService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}
