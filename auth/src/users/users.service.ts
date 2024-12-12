import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findUserByEmail = async (email: string): Promise<User | null> => {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    return user;
  };

  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.findUserByEmail(userData.email);

    if (existingUser) throw new ConflictException('USer alrady exists');

    const hashedPassword = await hash(userData.password, 10);

    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }
}
