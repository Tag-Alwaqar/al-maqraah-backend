import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFeesTable1723405207139 implements MigrationInterface {
    name = 'AlterFeesTable1723405207139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees" ADD "month" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees" DROP COLUMN "month"`);
    }

}
