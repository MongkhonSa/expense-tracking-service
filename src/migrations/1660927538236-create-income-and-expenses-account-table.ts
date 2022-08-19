import { MigrationInterface, QueryRunner } from 'typeorm';

export class createIncomeAndExpensesAccountTable1660927538236
  implements MigrationInterface
{
  name = 'createIncomeAndExpensesAccountTable1660927538236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "income_and_expenses_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_income" integer NOT NULL DEFAULT '0', "total_expenses" integer NOT NULL DEFAULT '0', "user_id" uuid, CONSTRAINT "REL_0a92b62cb65ad4256e2d9c742a" UNIQUE ("user_id"), CONSTRAINT "PK_f23767c0e2186f825695f662692" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_and_expenses_account" ADD CONSTRAINT "FK_0a92b62cb65ad4256e2d9c742a8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "income_and_expenses_account" DROP CONSTRAINT "FK_0a92b62cb65ad4256e2d9c742a8"`,
    );
    await queryRunner.query(`DROP TABLE "income_and_expenses_account"`);
  }
}
