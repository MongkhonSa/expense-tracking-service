import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEnumTypeToTransactionTable1661016642047
  implements MigrationInterface
{
  name = 'addEnumTypeToTransactionTable1661016642047';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('income', 'expenses')`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "type" "public"."transaction_type_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
  }
}
