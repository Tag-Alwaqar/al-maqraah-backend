import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupTable1722610135848 implements MigrationInterface {
    name = 'AddGroupTable1722610135848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "groups" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "type" character varying NOT NULL, "gender" character varying NOT NULL, "admin_id" integer, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0c0a90cf7f683f8ca8cf0e1a2d" ON "groups" ("name") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE TABLE "groups_students_students" ("groupsId" integer NOT NULL, "studentsId" integer NOT NULL, CONSTRAINT "PK_c826388d388d9baa2bda57ba2eb" PRIMARY KEY ("groupsId", "studentsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0a13c314755635e495546b352b" ON "groups_students_students" ("groupsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_07a78939b3255e9dc14e344a00" ON "groups_students_students" ("studentsId") `);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_6cb1e260e901719aee56add582d" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups_students_students" ADD CONSTRAINT "FK_0a13c314755635e495546b352b1" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "groups_students_students" ADD CONSTRAINT "FK_07a78939b3255e9dc14e344a006" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups_students_students" DROP CONSTRAINT "FK_07a78939b3255e9dc14e344a006"`);
        await queryRunner.query(`ALTER TABLE "groups_students_students" DROP CONSTRAINT "FK_0a13c314755635e495546b352b1"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_6cb1e260e901719aee56add582d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_07a78939b3255e9dc14e344a00"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a13c314755635e495546b352b"`);
        await queryRunner.query(`DROP TABLE "groups_students_students"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c0a90cf7f683f8ca8cf0e1a2d"`);
        await queryRunner.query(`DROP TABLE "groups"`);
    }

}
