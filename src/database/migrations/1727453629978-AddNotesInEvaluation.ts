import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotesInEvaluation1727453629978 implements MigrationInterface {
    name = 'AddNotesInEvaluation1727453629978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD "notes" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP COLUMN "notes"`);
    }

}
