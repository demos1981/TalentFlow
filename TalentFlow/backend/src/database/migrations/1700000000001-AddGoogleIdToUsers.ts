import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleIdToUsers1700000000001 implements MigrationInterface {
    name = 'AddGoogleIdToUsers1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Перевіряємо, чи існує колонка googleId
        const table = await queryRunner.getTable('users');
        const googleIdColumn = table?.findColumnByName('googleId');
        
        if (!googleIdColumn) {
            await queryRunner.query(`ALTER TABLE "users" ADD "googleId" varchar`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "googleId"`);
    }
}
