import { MigrationInterface, QueryRunner } from "typeorm";

export class RelateEvaluationToSession1723889736424 implements MigrationInterface {
    name = 'RelateEvaluationToSession1723889736424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD "session_id" integer`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD "session_id" integer`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD CONSTRAINT "FK_daf8b3c5446c3b13c95b320edae" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD CONSTRAINT "FK_7ff52b0e05bebd7b9755ac61b3e" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP CONSTRAINT "FK_7ff52b0e05bebd7b9755ac61b3e"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP CONSTRAINT "FK_daf8b3c5446c3b13c95b320edae"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP COLUMN "session_id"`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP COLUMN "session_id"`);
    }

}
