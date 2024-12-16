import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { UsersService } from "src/users/users.service";
import { User } from "src/entities/user.entity";
import { Request } from "express";
import * as process from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.AccessToken,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY
        });
    }

    async validate(payload: TokenPayload): Promise<User> {
        return this.usersService.findOneById(payload.userId)
    }
}