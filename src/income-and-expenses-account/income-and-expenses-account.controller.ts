import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { GetReportDto } from './dto/get-report-dto';
import { IncomeAndExpensesAccountService } from './income-and-expenses-account.service';
import { CurrentUser } from '../user.decorator';
@Controller('income-and-expenses-account')
@UseGuards(JwtAuthGuard)
export class IncomeAndExpensesAccountController {
  constructor(
    private readonly incomeAndExpensesAccountService: IncomeAndExpensesAccountService,
  ) {}

  @Get('')
  findOne(@CurrentUser() user) {
    return this.incomeAndExpensesAccountService.findOneByUserId(user.userId);
  }

  @Post('/income')
  createIncomeRecord(
    @CurrentUser() user,
    @Body() createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    return this.incomeAndExpensesAccountService.createIncomeRecord(
      user.userId,
      createTransactionRecordDto,
    );
  }
  @Post('/expenses')
  createExpensesRecord(
    @CurrentUser() user,
    @Body() createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    return this.incomeAndExpensesAccountService.createExpensesRecord(
      user.userId,
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
