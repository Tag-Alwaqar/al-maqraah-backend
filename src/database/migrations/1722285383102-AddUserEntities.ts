import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEntities1722285383102 implements MigrationInterface {
    name = 'AddUserEntities1722285383102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admins" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, CONSTRAINT "REL_2b901dd818a2a6486994d915a6" UNIQUE ("user_id"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teachers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, CONSTRAINT "REL_4668d4752e6766682d1be0b346" UNIQUE ("user_id"), CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "current_surah" integer NOT NULL, "current_ayah" integer, CONSTRAINT "REL_fb3eff90b11bddf7285f9b4e28" UNIQUE ("user_id"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying NOT NULL, "password" character varying NOT NULL, "previous_password" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "gender" character varying NOT NULL, "born_at" date NOT NULL, "approved" boolean NOT NULL DEFAULT false, "forget_pass_token" character varying, "admin_id" integer, "teacher_id" integer, "student_id" integer, CONSTRAINT "REL_4f0f50d9922a0ed51c214f5556" UNIQUE ("admin_id"), CONSTRAINT "REL_6732917f537f13ea6555a8b493" UNIQUE ("teacher_id"), CONSTRAINT "REL_4bcc4fd204f448ad671c0747ab" UNIQUE ("student_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f24da044bd6e4f3f5228d4dc51" ON "users" ("code") WHERE deleted_at IS NULL`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_2b901dd818a2a6486994d915a68" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teachers" ADD CONSTRAINT "FK_4668d4752e6766682d1be0b346f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4f0f50d9922a0ed51c214f5556b" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6732917f537f13ea6555a8b493e" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4bcc4fd204f448ad671c0747ab4" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4bcc4fd204f448ad671c0747ab4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6732917f537f13ea6555a8b493e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4f0f50d9922a0ed51c214f5556b"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281"`);
        await queryRunner.query(`ALTER TABLE "teachers" DROP CONSTRAINT "FK_4668d4752e6766682d1be0b346f"`);
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_2b901dd818a2a6486994d915a68"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f24da044bd6e4f3f5228d4dc51"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
        await queryRunner.query(`DROP TABLE "admins"`);
    }

}
