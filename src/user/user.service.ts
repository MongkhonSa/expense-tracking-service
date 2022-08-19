import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SALT_ROUND } from '../const';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const password = bcrypt.hashSync(createUserDto.password, SALT_ROUND);
    return this.usersRepository.save({ ...createUserDto, password });
  }

  findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }
}
