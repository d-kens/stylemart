import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserReponseDto } from 'src/dtos/user-reponse.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RoleEnum } from 'src/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<UserReponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserReponseDto(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<UserReponseDto> {
    const result = await this.usersService.findOneById(userId);
    return new UserReponseDto(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async update(
    userData: UpdateUserDto,
    @Param('userId') userId: string,
  ): Promise<UserReponseDto> {
    const result = await this.usersService.update(userId, userData);
    return new UserReponseDto(result);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  async delete(@Param('userId') userId: string) {
    return await this.usersService.delete(userId);
  }
}
