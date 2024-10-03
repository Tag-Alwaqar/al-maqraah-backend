import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupAppointments1727975526865 implements MigrationInterface {
    name = 'AddGroupAppointments1727975526865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."group_appointments_weekday_enum" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')`);
        await queryRunner.query(`CREATE TABLE "group_appointments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "weekday" "public"."group_appointments_weekday_enum" NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "group_id" integer NOT NULL, CONSTRAINT "PK_e6a9d73f02f158ef3687c2997c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group_appointments" ADD CONSTRAINT "FK_d7112421021c314610454ec92ee" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_appointments" DROP CONSTRAINT "FK_d7112421021c314610454ec92ee"`);
        await queryRunner.query(`DROP TABLE "group_appointments"`);
        await queryRunner.query(`DROP TYPE "public"."group_appointments_weekday_enum"`);
    }

}
