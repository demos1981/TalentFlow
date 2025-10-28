import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateEventsTable1700000000005 implements MigrationInterface {
    name = 'CreateEventsTable1700000000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Перевіряємо чи таблиця events вже існує
        const tableExists = await queryRunner.hasTable("events");
        
        if (!tableExists) {
            // Створюємо enum типи тільки якщо вони не існують
            try {
                await queryRunner.query(`CREATE TYPE "public"."event_type" AS ENUM('interview', 'meeting', 'deadline', 'reminder', 'other')`);
            } catch (error) {
                // Enum вже існує, ігноруємо помилку
                console.log('event_type вже існує');
            }

            try {
                await queryRunner.query(`CREATE TYPE "public"."event_priority" AS ENUM('low', 'medium', 'high', 'urgent')`);
            } catch (error) {
                // Enum вже існує, ігноруємо помилку
                console.log('event_priority вже існує');
            }

            // Створюємо таблицю events
            await queryRunner.createTable(
                new Table({
                    name: "events",
                    columns: [
                        { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                        { name: "title", type: "varchar", isNullable: false, },
                        { name: "description", type: "text", isNullable: true, },
                        { name: "startDate", type: "timestamp", isNullable: false, },
                        { name: "endDate", type: "timestamp", isNullable: true, },
                        { name: "type", type: "enum", enum: ["interview", "meeting", "deadline", "reminder", "other"], default: "'other'", },
                        { name: "priority", type: "enum", enum: ["low", "medium", "high", "urgent"], default: "'medium'", },
                        { name: "isAllDay", type: "boolean", default: false, },
                        { name: "isRecurring", type: "boolean", default: false, },
                        { name: "recurrenceRule", type: "json", isNullable: true, },
                        { name: "isCompleted", type: "boolean", default: false, },
                        { name: "location", type: "json", isNullable: true, },
                        { name: "attendees", type: "json", isNullable: true, },
                        { name: "reminders", type: "json", isNullable: true, },
                        { name: "tags", type: "text", isArray: true, isNullable: true, },
                        { name: "metadata", type: "json", isNullable: true, },
                        { name: "createdById", type: "uuid", isNullable: false, },
                        { name: "createdAt", type: "timestamp", default: "now()", },
                        { name: "updatedAt", type: "timestamp", default: "now()", },
                    ],
                }),
                true
            );

            // Створюємо foreign key тільки якщо він не існує
            try {
                await queryRunner.createForeignKey(
                    "events",
                    new TableForeignKey({
                        columnNames: ["createdById"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE",
                    })
                );
            } catch (error) {
                // Foreign key вже існує, ігноруємо помилку
                console.log('Foreign key для createdById вже існує');
            }

            // Створюємо індекси тільки якщо вони не існують
            try {
                await queryRunner.query(`CREATE INDEX "IDX_events_startDate" ON "events" ("startDate")`);
            } catch (error) {
                console.log('Індекс IDX_events_startDate вже існує');
            }

            try {
                await queryRunner.query(`CREATE INDEX "IDX_events_createdById" ON "events" ("createdById")`);
            } catch (error) {
                console.log('Індекс IDX_events_createdById вже існує');
            }

            try {
                await queryRunner.query(`CREATE INDEX "IDX_events_type" ON "events" ("type")`);
            } catch (error) {
                console.log('Індекс IDX_events_type вже існує');
            }

            try {
                await queryRunner.query(`CREATE INDEX "IDX_events_isCompleted" ON "events" ("isCompleted")`);
            } catch (error) {
                console.log('Індекс IDX_events_isCompleted вже існує');
            }
        } else {
            console.log('Таблиця events вже існує, пропускаємо створення');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Видаляємо таблицю тільки якщо вона існує
        const tableExists = await queryRunner.hasTable("events");
        if (tableExists) {
            await queryRunner.dropTable("events");
        }
    }
}
