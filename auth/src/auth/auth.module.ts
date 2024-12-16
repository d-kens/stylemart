import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from 'src/events/notification/notification.service';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [UsersModule, JwtModule],
  providers: [
    AuthService,
    NotificationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
