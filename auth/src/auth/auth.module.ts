import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/events/notification/notification.service';

@Module({
  imports: [
      UsersModule, 
      JwtModule.registerAsync({
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: `${configService.get<number>('JWT_EXPIRES_IN')}s` },
        }),
        inject: [ConfigService]
      }),
  ],
  providers: [AuthService, NotificationService],
  controllers: [AuthController]
})
export class AuthModule {}
