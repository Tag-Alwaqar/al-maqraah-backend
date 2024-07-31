import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsSuperToAdmin1722441316011 implements MigrationInterface {
    name = 'AddIsSuperToAdmin1722441316011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" ADD "is_super" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP COLUMN "is_super"`);
    }

}
