import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionRecordDto {
  @IsNotEmpty()
  @IsString()
  categoryName: string;
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
