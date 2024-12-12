import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOneById(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: userId },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.findUserByEmail(userData.email);

    if (existingUser) throw new ConflictException('User alrady exists');

    try {
      const hashedPassword = await hash(userData.password, 10);

      const newUser = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
      });

      return this.usersRepository.save(newUser);
    } catch (error) {
      this.logger.error('Error Creating User', error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async update(userId: string, userData: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOneById(userId);

    if (!existingUser)
      throw new NotFoundException(`User with user ID ${userId} not found`);

    try {
      const updatedUser = Object.assign(existingUser, userData);
      return await this.usersRepository.save(updatedUser);
    } catch (error) {
      this.logger.error('Error Updating User', error);
      throw new InternalServerErrorException('Could not update user');
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
  }
}
