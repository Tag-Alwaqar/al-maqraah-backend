import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeesTable1723294081676 implements MigrationInterface {
    name = 'AddFeesTable1723294081676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fees" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "admin_id" integer NOT NULL, "group_id" integer NOT NULL, "student_id" integer NOT NULL, "price" double precision NOT NULL, CONSTRAINT "PK_97f3a1b1b8ee5674fd4da93f461" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "fees" ADD CONSTRAINT "FK_a213503a215d9ca4ca8cb8109e7" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fees" ADD CONSTRAINT "FK_08046bc20aaa06cfd5bd4d28ad5" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fees" ADD CONSTRAINT "FK_1ad84dd647a6c4464ed46829b25" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fees" DROP CONSTRAINT "FK_1ad84dd647a6c4464ed46829b25"`);
        await queryRunner.query(`ALTER TABLE "fees" DROP CONSTRAINT "FK_08046bc20aaa06cfd5bd4d28ad5"`);
        await queryRunner.query(`ALTER TABLE "fees" DROP CONSTRAINT "FK_a213503a215d9ca4ca8cb8109e7"`);
        await queryRunner.query(`DROP TABLE "fees"`);
    }

}
