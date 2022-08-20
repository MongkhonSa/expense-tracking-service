import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IncomeAndExpensesAccount } from './income-and-expenses-account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryName: string;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(
    () => IncomeAndExpensesAccount,
    (incomeAndExpensesAccount) => incomeAndExpensesAccount.transaction,
  )
  incomeAndExpensesAccount: IncomeAndExpensesAccount[];
}
