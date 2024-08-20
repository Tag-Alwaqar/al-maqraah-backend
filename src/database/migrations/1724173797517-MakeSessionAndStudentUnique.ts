import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeSessionAndStudentUnique1724173797517 implements MigrationInterface {
    name = 'MakeSessionAndStudentUnique1724173797517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP CONSTRAINT "FK_daf8b3c5446c3b13c95b320edae"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ALTER COLUMN "session_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP CONSTRAINT "FK_7ff52b0e05bebd7b9755ac61b3e"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ALTER COLUMN "session_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD CONSTRAINT "UQ_8dbad21d2df2a26bf9b171b015b" UNIQUE ("session_id", "student_id")`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD CONSTRAINT "UQ_8710b651658fc03db671af31f44" UNIQUE ("session_id", "student_id")`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD CONSTRAINT "FK_daf8b3c5446c3b13c95b320edae" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD CONSTRAINT "FK_7ff52b0e05bebd7b9755ac61b3e" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP CONSTRAINT "FK_7ff52b0e05bebd7b9755ac61b3e"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP CONSTRAINT "FK_daf8b3c5446c3b13c95b320edae"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP CONSTRAINT "UQ_8710b651658fc03db671af31f44"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP CONSTRAINT "UQ_8dbad21d2df2a26bf9b171b015b"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ALTER COLUMN "session_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD CONSTRAINT "FK_7ff52b0e05bebd7b9755ac61b3e" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ALTER COLUMN "session_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD CONSTRAINT "FK_daf8b3c5446c3b13c95b320edae" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
