import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { TRANSACTION_ENUM } from '../const';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { GetReportDto } from './dto/get-report-dto';
import { IncomeAndExpensesAccountService } from './income-and-expenses-account.service';

@Controller('income-and-expenses-account')
@UseGuards(JwtAuthGuard)
export class IncomeAndExpensesAccountController {
  constructor(
    private readonly incomeAndExpensesAccountService: IncomeAndExpensesAccountService,
  ) {}

  @Get('')
  findOne(@Req() req) {
    return this.incomeAndExpensesAccountService.findOneByUserId(
      req.user.userId,
    );
  }

  @Post('/income')
  createIncomeRecord(
    @Req() req,
    @Body() createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    return this.incomeAndExpensesAccountService.createIncomeRecord(
      req.user.userId,
      createTransactionRecordDto,
    );
  }
  @Post('/expenses')
  createExpensesRecord(
    @Req() req,
    @Body() createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    return this.incomeAndExpensesAccountService.createExpensesRecord(
      req.user.userId,
      createTransactionRecordDto,
    );
  }
  @Post('report')
  async getReport(
    @Body() getReportDto: GetReportDto,
    @Res() response: Response,
  ) {
    const report =
      await this.incomeAndExpensesAccountService.findTransactionByType(
        getReportDto.type,
        getReportDto.startDate,
        getReportDto.endDate,
      );
    return response.status(HttpStatus.OK).send(report);
  }
}
