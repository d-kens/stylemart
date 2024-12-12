import { Controller, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
