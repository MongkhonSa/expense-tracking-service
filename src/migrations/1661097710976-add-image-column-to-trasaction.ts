import { MigrationInterface, QueryRunner } from 'typeorm';

export class addImageColumnToTrasaction1661097710976
  implements MigrationInterface
{
  name = 'addImageColumnToTrasaction1661097710976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "image" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "image"`);
  }
}
