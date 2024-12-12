import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from 'src/events/notification/notification.service';
import { EmailVerificationNotification } from 'src/dtos/notification-payload';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private notificationService: NotificationService
    ) {}


    async register(userData: CreateUserDto) {
        const user =  await this.userService.create(userData);

        const token = this.jwtService.sign({ sub: user.id, email: user.email })
        
        const verificationLink = `http://your-app.com/verify-email?token=${token}`;  

        const emailVerificationData: EmailVerificationNotification = {
            clientEmail: user.email,
            verificationLink
        }

        await this.notificationService.sendVerificationEmail(emailVerificationData)

        return { message: 'Registration successful. Please check your email for verification.' };
    }
}
