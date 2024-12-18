import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/entities/token.entity';
import { Repository } from 'typeorm';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as process from 'process';
import { TokenType } from 'src/enums/toke-type.enum';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async createToken(
    userId: string,
    email: string,
    tokenType: TokenType,
  ): Promise<string> {
    const token = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: `${process.env.VERIFICATION_TOKEN_EXPIRATION_MS}ms`,
      },
    );

    await this.tokenRepository.save({
      token,
      tokenType,
      used: false,
      user: { id: userId },
    });

    return token;
  }

  async validateToken(token: string): Promise<User> {
    try {
      const tokenRecord = await this.tokenRepository.findOne({
        where: { token },
      });

      console.log('Fetched token record: ' + tokenRecord);

      if (!tokenRecord) {
        throw new BadRequestException('Verification token not found');
      }

      if (tokenRecord.used) {
        throw new BadRequestException(
          'Verification token has already been used',
        );
      }

      const tokenDecoded = this.jwtService.verify(tokenRecord.token, {
        secret: process.env.SECRET_KEY,
      });

      await this.markTokenAsUsed(tokenRecord.token);

      return await this.usersService.findOneById(tokenDecoded.sub);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Verification token has expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('Invalid verification token');
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while verifying the token',
        );
      }
    }
  }

  async markTokenAsUsed(token: string): Promise<void> {
    await this.tokenRepository.update({ token }, { used: true });
  }
}
