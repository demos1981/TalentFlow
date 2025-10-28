import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateJobTypes1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Спочатку оновлюємо існуючі значення зі старих на нові
    await queryRunner.query(`
      UPDATE jobs 
      SET type = 'full_time' 
      WHERE type = 'full-time'
    `);
    
    await queryRunner.query(`
      UPDATE jobs 
      SET type = 'part_time' 
      WHERE type = 'part-time'
    `);
    
    // Видаляємо значення за замовчуванням з колонки
    await queryRunner.query(`
      ALTER TABLE jobs 
      ALTER COLUMN type DROP DEFAULT
    `);
    
    // Тепер оновлюємо enum тип
    await queryRunner.query(`
      ALTER TYPE jobs_type_enum RENAME TO jobs_type_enum_old
    `);
    
    await queryRunner.query(`
      CREATE TYPE jobs_type_enum AS ENUM (
        'full_time',
        'part_time',
        'contract',
        'internship',
        'freelance',
        'remote'
      )
    `);
    
    // Конвертуємо колонку в новий тип
    await queryRunner.query(`
      ALTER TABLE jobs 
      ALTER COLUMN type TYPE jobs_type_enum 
      USING type::text::jobs_type_enum
    `);
    
    // Встановлюємо нове значення за замовчуванням
    await queryRunner.query(`
      ALTER TABLE jobs 
      ALTER COLUMN type SET DEFAULT 'full_time'
    `);
    
    // Видаляємо старий enum
    await queryRunner.query(`
      DROP TYPE jobs_type_enum_old
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Відкат до старого enum
    await queryRunner.query(`
      ALTER TYPE jobs_type_enum RENAME TO jobs_type_enum_new
    `);
    
    await queryRunner.query(`
      CREATE TYPE jobs_type_enum AS ENUM (
        'full_time',
        'part_time',
        'contract',
        'internship',
        'freelance',
        'remote',
        'full-time',
        'part-time'
      )
    `);
    
    // Видаляємо значення за замовчуванням
    await queryRunner.query(`
      ALTER TABLE jobs 
      ALTER COLUMN type DROP DEFAULT
    `);
    
    // Конвертуємо назад
    await queryRunner.query(`
      ALTER TABLE jobs 
      ALTER COLUMN type TYPE jobs_type_enum 
      USING type::text::jobs_type_enum
    `);
    
    // Встановлюємо старе значення за замовчуванням
    await queryRunner.query(`
      ALTER TABLE jobs 
      ALTER COLUMN type SET DEFAULT 'full-time'
    `);
    
    // Видаляємо новий enum
    await queryRunner.query(`
      DROP TYPE jobs_type_enum_new
    `);
  }
}
