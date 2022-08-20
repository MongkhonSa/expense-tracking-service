import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTransactionTable1661012044723 implements MigrationInterface {
  name = 'createTransactionTable1661012044723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_name" character varying NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "income_and_expenses_account_id" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_060a679b7b01f1d5ffe9721215b" FOREIGN KEY ("income_and_expenses_account_id") REFERENCES "income_and_expenses_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_060a679b7b01f1d5ffe9721215b"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
