import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserReponseDto } from 'src/dtos/user-reponse.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RoleEnum } from 'src/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

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

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
