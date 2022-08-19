import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
