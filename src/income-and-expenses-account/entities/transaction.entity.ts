import { TRANSACTION_ENUM } from '../../const';
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

  @Column({ type: 'enum', enum: TRANSACTION_ENUM })
  type: TRANSACTION_ENUM;

  @Column()
  amount: number;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(
    () => IncomeAndExpensesAccount,
    (incomeAndExpensesAccount) => incomeAndExpensesAccount.transaction,
  )
  incomeAndExpensesAccount: IncomeAndExpensesAccount;
}
