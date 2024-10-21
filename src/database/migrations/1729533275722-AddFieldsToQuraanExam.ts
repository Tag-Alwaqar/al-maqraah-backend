import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToQuraanExam1729533275722 implements MigrationInterface {
    name = 'AddFieldsToQuraanExam1729533275722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" ADD "month" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" ADD "from" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" ADD "to" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" DROP COLUMN "to"`);
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" DROP COLUMN "from"`);
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" DROP COLUMN "month"`);
    }

}
