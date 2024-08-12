import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionTable1723476581998 implements MigrationInterface {
    name = 'AddSessionTable1723476581998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "group_id" integer NOT NULL, "teacher_id" integer NOT NULL, "duration" integer NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_29cb65ff2ae5b234efbe9b6c09b" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_160d27f30b396f2bdae820980b3" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_160d27f30b396f2bdae820980b3"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_29cb65ff2ae5b234efbe9b6c09b"`);
        await queryRunner.query(`ALTER TABLE "quraan_evaluation" ADD "duration" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sharia_evaluation" ADD "duration" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "sessions"`);
    }

}
