import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class IncomeAndExpensesAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  totalIncome: number;

  @Column({ default: 0 })
  totalExpenses: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @OneToMany(
    () => Transaction,
    (transaction) => transaction.incomeAndExpensesAccount,
  )
  transaction: Transaction[];
}
