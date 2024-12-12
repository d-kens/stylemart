import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from 'src/events/notification/notification.service';

@Module({
  imports: [UsersModule, JwtModule],
  providers: [AuthService, NotificationService],
  controllers: [AuthController],
})
export class AuthModule {}
