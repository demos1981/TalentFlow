import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateJobsTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'requirements',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'benefits',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'remote',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['full_time', 'part_time', 'contract', 'internship', 'freelance'],
            default: "'full_time'",
          },
          {
            name: 'experienceLevel',
            type: 'enum',
            enum: ['entry', 'junior', 'middle', 'senior', 'lead', 'executive'],
            default: "'middle'",
          },
          {
            name: 'salaryMin',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'salaryMax',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'department',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'skills',
            type: 'text',
            isNullable: true,
            comment: 'JSON array of skills',
          },
          {
            name: 'tags',
            type: 'text',
            isNullable: true,
            comment: 'JSON array of tags',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'active', 'paused', 'closed', 'expired'],
            default: "'draft'",
          },
          {
            name: 'isUrgent',
            type: 'boolean',
            default: false,
          },
          {
            name: 'isFeatured',
            type: 'boolean',
            default: false,
          },
          {
            name: 'deadline',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'views',
            type: 'integer',
            default: 0,
          },
          {
            name: 'applications',
            type: 'integer',
            default: 0,
          },
          {
            name: 'companyId',
            type: 'uuid',
            isNullable: true, // Зробили опціональним
          },
          {
            name: 'createdByUserId',
            type: 'uuid',
            isNullable: true, // Зробили опціональним
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'publishedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'closedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Створюємо індекси для швидкого пошуку
    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_STATUS',
        columnNames: ['status'],
      })
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_COMPANY',
        columnNames: ['companyId'],
      })
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_TYPE',
        columnNames: ['type'],
      })
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_EXPERIENCE_LEVEL',
        columnNames: ['experienceLevel'],
      })
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_LOCATION',
        columnNames: ['location'],
      })
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_CREATED_AT',
        columnNames: ['createdAt'],
      })
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_FEATURED',
        columnNames: ['isFeatured'],
      })
    );

    // Створюємо зовнішній ключ для зв\'язку з користувачем (опціонально)
    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        name: 'FK_JOBS_COMPANY',
        columnNames: ['companyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'SET NULL', // Змінили на SET NULL
      })
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        name: 'FK_JOBS_CREATED_BY_USER',
        columnNames: ['createdByUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL', // Змінили на SET NULL
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Видаляємо зовнішні ключі
    const table = await queryRunner.getTable('jobs');
    const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('companyId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('jobs', foreignKey);
    }

    const foreignKeyCreatedByUser = table?.foreignKeys.find(fk => fk.columnNames.indexOf('createdByUserId') !== -1);
    if (foreignKeyCreatedByUser) {
      await queryRunner.dropForeignKey('jobs', foreignKeyCreatedByUser);
    }

    // Видаляємо таблицю
    await queryRunner.dropTable('jobs');
  }
}
