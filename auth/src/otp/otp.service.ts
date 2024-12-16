import { GoneException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as otplib from 'otplib';
import { OTP } from 'src/entities/otp.entity';
import { NotificationService } from 'src/events/notification/notification.service';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import { OtpNotification } from 'src/dtos/notification-payload';

otplib.authenticator.options = {
    digits: 6,
};

@Injectable()
export class OtpService {

    constructor(
        @InjectRepository(OTP)
        private otpRepository: Repository<OTP>,
        private notificationService: NotificationService,
    ) {}


    private async generateAndSaveOTP(userId: string) {
        const secretKey = authenticator.generateSecret();
        const otp = authenticator.generate(secretKey);

        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 5);

        const existingOtp = await this.otpRepository.findOne({ where: { userId } });

        if (existingOtp) {
            existingOtp.otp = otp;
            existingOtp.expiryTime = expiryTime.toISOString();
            existingOtp.verified = false;
            await this.otpRepository.save(existingOtp);
      
            return existingOtp;
        }
      
        const newOtp = this.otpRepository.create({
            userId,
            otp,
            expiryTime: expiryTime.toISOString(),
            verified: false,
        });
      
        await this.otpRepository.save(newOtp);
      
        return newOtp;
    }


    async requestOTP(userId: string, email: string): Promise<void> {
        const result = await this.generateAndSaveOTP(userId);

        const otpData: OtpNotification = {
            clientEmail: email,
            otp: result.otp,
            otpLifeSpan: 5,
        }

        await this.notificationService.sendOtpNotification(otpData);
    }
    


    async verifyOTP(userId: string, otp: string): Promise<{ message: string }> {
        const otpEntry = await this.otpRepository.findOne({ where: { userId } });
    
        if (!otpEntry) {
          throw new NotFoundException('No OTP found for the user.');
        }
        const currentTime = new Date();
        const expiryTime = new Date(otpEntry.expiryTime);
    
        if (currentTime > expiryTime) {
          throw new GoneException('OTP has expired');
        }
    
        if (otpEntry.verified) {
          throw new GoneException('OTP has already been used. Generate a new one.');
        }
    
        if (otp !== otpEntry.otp) {
          throw new UnauthorizedException('Invalid OTP.');
        }
    
        otpEntry.verified = true;
        await this.otpRepository.save(otpEntry);


        

    
        return { message: 'OTP verification successful.' };
    }
    
    async revokeOTP(userId: string): Promise<{ message: string }> {
        const result = await this.otpRepository.delete({ userId });
    
        if (result.affected === 0) {
          throw new NotFoundException(`OTP with ID: ${userId} not found`);
        }
    
        return { message: 'OTP revoked succesfully' };
    }

}
