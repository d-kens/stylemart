import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private mailerService: MailerService,
        private jwtService: JwtService
    ) {}


    async register(userData: CreateUserDto) {
        const user =  await this.userService.create(userData);

        const token = this.jwtService.sign({ sub: user.id, email: user.email })
        
        const verificationUrl = `http://your-app.com/verify-email?token=${token}`;  

        await this.mailerService.sendVerificationEmail(user.email, verificationUrl)

        return { message: 'Registration successful. Please check your email for verification.' };
    }
}
