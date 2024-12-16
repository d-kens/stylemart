, import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [UsersModule,JwtModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
