import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuraanExamEvaluation1727810408711 implements MigrationInterface {
    name = 'AddQuraanExamEvaluation1727810408711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quraan_exam_evaluation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "group_id" integer NOT NULL, "student_id" integer NOT NULL, "memorizing" integer NOT NULL, "tajweed" integer NOT NULL, CONSTRAINT "PK_042180715baa6ea19a17a2fdb85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" ADD CONSTRAINT "FK_c1e022b4d730efd16440f2039e1" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" ADD CONSTRAINT "FK_8fd25f3b76da0453681b4e11c7c" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" DROP CONSTRAINT "FK_8fd25f3b76da0453681b4e11c7c"`);
        await queryRunner.query(`ALTER TABLE "quraan_exam_evaluation" DROP CONSTRAINT "FK_c1e022b4d730efd16440f2039e1"`);
        await queryRunner.query(`DROP TABLE "quraan_exam_evaluation"`);
    }

}
