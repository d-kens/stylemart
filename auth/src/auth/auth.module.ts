import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
      MailerModule
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
