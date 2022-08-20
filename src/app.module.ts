import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import postgresConfig from './config/postgresConfig';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { IncomeAndExpensesAccountModule } from './income-and-expenses-account/income-and-expenses-account.module';
import { IncomeAndExpensesAccount } from './income-and-expenses-account/entities/income-and-expenses-account.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: postgresConfig.host,
      port: postgresConfig.port,
      username: postgresConfig.username,
      password: postgresConfig.password,
      database: postgresConfig.databaseName,
      entities: [User, IncomeAndExpensesAccount],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: false,
      migrations: ['migration/*.ts'],
    }),
    UserModule,
    IncomeAndExpensesAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
