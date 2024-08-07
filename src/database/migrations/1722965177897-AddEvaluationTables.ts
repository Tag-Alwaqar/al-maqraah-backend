import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEvaluationTables1722965177897 implements MigrationInterface {
    name = 'AddEvaluationTables1722965177897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quraan_evaluation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "group_id" integer NOT NULL, "student_id" integer NOT NULL, "teacher_id" integer NOT NULL, "ethics_grade" boolean NOT NULL, "duration" integer NOT NULL, "current_revision" json NOT NULL, "next_revision" json NOT NULL, "current_new_surah" json NOT NULL, "next_new_surah" json NOT NULL, "tajweed_grade" integer NOT NULL, CONSTRAINT "PK_3c5c5bc158520d458ba29638758" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sharia_evaluation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "group_id" integer NOT NULL, "student_id" integer NOT NULL, "teacher_id" integer NOT NULL, "ethics_grade" boolean NOT NULL, "duration" integer NOT NULL, "attended" boolean NOT NULL, CONSTRAINT "PK_2f4c3677d06346c9b8a385448fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exam_evaluation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "group_id" integer NOT NULL, "student_id" integer NOT NULL, "max_grade" integer NOT NULL, "grade" integer NOT NULL, CONSTRAINT "PK_c61abec88375735a8637aea90d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD CONSTRAINT "FK_6e97844784f074adf1b9c081e8a" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD CONSTRAINT "FK_9ecdb903b7515e7e67c0c58085b" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD CONSTRAINT "FK_0173344864328164668a0fd8fd1" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD CONSTRAINT "FK_c2aa7d7a61b1dbf6f562881d0ce" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD CONSTRAINT "FK_a38c60c8a14438431bbf8ff65e6" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD CONSTRAINT "FK_cb6a8d8bcd21c7cfb66ee9fb550" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_evaluation" ADD CONSTRAINT "FK_f7c0abf708aeb9cdbeb54a7a8f5" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam_evaluation" ADD CONSTRAINT "FK_8d3b9be987f65eac366a506477b" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_evaluation" DROP CONSTRAINT "FK_8d3b9be987f65eac366a506477b"`);
        await queryRunner.query(`ALTER TABLE "exam_evaluation" DROP CONSTRAINT "FK_f7c0abf708aeb9cdbeb54a7a8f5"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP CONSTRAINT "FK_cb6a8d8bcd21c7cfb66ee9fb550"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP CONSTRAINT "FK_a38c60c8a14438431bbf8ff65e6"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP CONSTRAINT "FK_c2aa7d7a61b1dbf6f562881d0ce"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP CONSTRAINT "FK_0173344864328164668a0fd8fd1"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP CONSTRAINT "FK_9ecdb903b7515e7e67c0c58085b"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP CONSTRAINT "FK_6e97844784f074adf1b9c081e8a"`);
        await queryRunner.query(`DROP TABLE "exam_evaluation"`);
        await queryRunner.query(`DROP TABLE "sharia_evaluation"`);
        await queryRunner.query(`DROP TABLE "quraan_evaluation"`);
    }

}
