import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from 'src/events/notification/notification.service';
import { LocalStrategy } from './strategies/local-strategy';

@Module({
  imports: [UsersModule, JwtModule],
  providers: [AuthService, NotificationService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
