import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAppointmentFields1728737607572
  implements MigrationInterface
{
  name = 'RenameAppointmentFields1728737607572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_appointments" RENAME COLUMN "startTime" TO "start_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_appointments" RENAME COLUMN "endTime" TO "end_time"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_appointments" RENAME COLUMN "start_time" TO "startTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_appointments" RENAME COLUMN "end_time" TO "endTime"`,
    );
  }
}
