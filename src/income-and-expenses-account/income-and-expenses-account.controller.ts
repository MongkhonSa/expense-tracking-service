import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { GetReportDto } from './dto/get-report-dto';
import { IncomeAndExpensesAccountService } from './income-and-expenses-account.service';
import { CurrentUser } from '../user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
    @CurrentUser() user,
  ) {
    const report =
      await this.incomeAndExpensesAccountService.findTransactionByType(
        user.userId,
        getReportDto.type,
        getReportDto.startDate,
        getReportDto.endDate,
      );
    return response.status(HttpStatus.OK).send(report);
  }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: /image*/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return file;
  }
}
