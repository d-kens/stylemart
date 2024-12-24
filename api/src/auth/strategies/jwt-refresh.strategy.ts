import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.RefreshToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
      passReqToCallback: true, // pass the incoming http request to the callback function
    });
  }

  async validate(request: Request, payload: TokenPayload): Promise<any> {
    return await this.authService.verifyRefreshToken(
      request.cookies?.RefreshToken,
      payload.userId,
    );
  }
}
