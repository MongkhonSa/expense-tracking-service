import { IsDateString, IsEnum } from 'class-validator';
import { TRANSACTION_ENUM } from '../../const';

export class GetReportDto {
  @IsDateString()
  startDate: Date;
  @IsDateString()
  endDate: Date;
  @IsEnum(TRANSACTION_ENUM)
  type: TRANSACTION_ENUM;
}
