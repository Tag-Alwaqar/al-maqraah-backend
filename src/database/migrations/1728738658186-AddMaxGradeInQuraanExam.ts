import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMaxGradeInQuraanExam1728738658186
  implements MigrationInterface
{
  name = 'AddMaxGradeInQuraanExam1728738658186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quraan_exam_evaluation" RENAME COLUMN "memorizing" TO "memorizing_grade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quraan_exam_evaluation" RENAME COLUMN "tajweed" TO "tajweed_grade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quraan_exam_evaluation" ADD "max_memorizing_grade" integer NOT NULL DEFAULT 100`,
    );
    await queryRunner.query(
      `ALTER TABLE "quraan_exam_evaluation" ADD "max_tajweed_grade" integer NOT NULL DEFAULT 100`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quraan_exam_evaluation" DROP COLUMN "max_tajweed_grade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quraan_exam_evaluation" DROP COLUMN "max_memorizing_grade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quraan_exam_evaluation" RENAME COLUMN "tajweed_grade" TO "tajweed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quraan_exam_evaluation" RENAME COLUMN "memorizing_grade" TO "memorizing"`,
    );
  }
}
