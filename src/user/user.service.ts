import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SALT_ROUND } from '../const';
import { IncomeAndExpensesAccount } from '../income-and-expenses-account/entities/income-and-expenses-account.entity';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const password = bcrypt.hashSync(createUserDto.password, SALT_ROUND);
    const user = this.usersRepository.create({
      ...createUserDto,
      password,
    });
    const incomeAndExpensesAccount = new IncomeAndExpensesAccount();
    incomeAndExpensesAccount.user = user;
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(user);
      await transactionalEntityManager.save(incomeAndExpensesAccount);
    });
    return user;
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
