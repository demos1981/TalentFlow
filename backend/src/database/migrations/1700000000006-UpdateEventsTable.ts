import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm";

export class UpdateEventsTable1700000000006 implements MigrationInterface {
    name = 'UpdateEventsTable1700000000006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Додаємо нові enum типи
        try {
            await queryRunner.query(`ALTER TYPE "public"."event_type" ADD VALUE 'training'`);
        } catch (error) {
            console.log('event_type training вже існує');
        }

        try {
            await queryRunner.query(`ALTER TYPE "public"."event_type" ADD VALUE 'conference'`);
        } catch (error) {
            console.log('event_type conference вже існує');
        }

        try {
            await queryRunner.query(`ALTER TYPE "public"."event_type" ADD VALUE 'workshop'`);
        } catch (error) {
            console.log('event_type workshop вже існує');
        }

        try {
            await queryRunner.query(`ALTER TYPE "public"."event_type" ADD VALUE 'presentation'`);
        } catch (error) {
            console.log('event_type presentation вже існує');
        }

        try {
            await queryRunner.query(`ALTER TYPE "public"."event_type" ADD VALUE 'review'`);
        } catch (error) {
            console.log('event_type review вже існує');
        }

        // Створюємо нові enum типи
        try {
            await queryRunner.query(`CREATE TYPE "public"."event_status_enum" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')`);
        } catch (error) {
            console.log('event_status_enum вже існує');
        }

        try {
            await queryRunner.query(`CREATE TYPE "public"."recurrence_type_enum" AS ENUM('none', 'daily', 'weekly', 'monthly', 'yearly')`);
        } catch (error) {
            console.log('recurrence_type_enum вже існує');
        }

        // Додаємо нові колонки
        const table = await queryRunner.getTable("events");
        if (table) {
            // Додаємо notes
            if (!table.findColumnByName("notes")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "notes",
                    type: "text",
                    isNullable: true
                }));
            }

            // Додаємо status
            if (!table.findColumnByName("status")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "status",
                    type: "enum",
                    enum: ["scheduled", "in_progress", "completed", "cancelled", "postponed"],
                    default: "'scheduled'"
                }));
            }

            // Додаємо recurrenceType
            if (!table.findColumnByName("recurrenceType")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "recurrenceType",
                    type: "enum",
                    enum: ["none", "daily", "weekly", "monthly", "yearly"],
                    default: "'none'"
                }));
            }

            // Додаємо completionPercentage
            if (!table.findColumnByName("completionPercentage")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "completionPercentage",
                    type: "int",
                    default: 0
                }));
            }

            // Додаємо locationDetails
            if (!table.findColumnByName("locationDetails")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "locationDetails",
                    type: "json",
                    isNullable: true
                }));
            }

            // Додаємо externalAttendees
            if (!table.findColumnByName("externalAttendees")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "externalAttendees",
                    type: "text",
                    isArray: true,
                    isNullable: true
                }));
            }

            // Додаємо isPrivate
            if (!table.findColumnByName("isPrivate")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "isPrivate",
                    type: "boolean",
                    default: false
                }));
            }

            // Додаємо isActive
            if (!table.findColumnByName("isActive")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "isActive",
                    type: "boolean",
                    default: true
                }));
            }

            // Додаємо completedAt
            if (!table.findColumnByName("completedAt")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "completedAt",
                    type: "timestamp",
                    isNullable: true
                }));
            }

            // Додаємо cancelledAt
            if (!table.findColumnByName("cancelledAt")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "cancelledAt",
                    type: "timestamp",
                    isNullable: true
                }));
            }

            // Додаємо cancellationReason
            if (!table.findColumnByName("cancellationReason")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "cancellationReason",
                    type: "text",
                    isNullable: true
                }));
            }

            // Додаємо jobId
            if (!table.findColumnByName("jobId")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "jobId",
                    type: "uuid",
                    isNullable: true
                }));
            }

            // Додаємо candidateId
            if (!table.findColumnByName("candidateId")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "candidateId",
                    type: "uuid",
                    isNullable: true
                }));
            }

            // Додаємо companyId
            if (!table.findColumnByName("companyId")) {
                await queryRunner.addColumn("events", new TableColumn({
                    name: "companyId",
                    type: "uuid",
                    isNullable: true
                }));
            }

            // Оновлюємо location з json на varchar
            const locationColumn = table.findColumnByName("location");
            if (locationColumn && locationColumn.type === "json") {
                await queryRunner.changeColumn("events", "location", new TableColumn({
                    name: "location",
                    type: "varchar",
                    length: "255",
                    isNullable: true
                }));
            }

            // Оновлюємо attendees з json на text array
            const attendeesColumn = table.findColumnByName("attendees");
            if (attendeesColumn && attendeesColumn.type === "json") {
                await queryRunner.changeColumn("events", "attendees", new TableColumn({
                    name: "attendees",
                    type: "text",
                    isArray: true,
                    isNullable: true
                }));
            }
        }

        // Створюємо нові індекси
        try {
            await queryRunner.createIndex("events", new TableIndex({
                name: "IDX_events_status",
                columnNames: ["status"]
            }));
        } catch (error) {
            console.log('Індекс IDX_events_status вже існує');
        }

        try {
            await queryRunner.createIndex("events", new TableIndex({
                name: "IDX_events_isActive",
                columnNames: ["isActive"]
            }));
        } catch (error) {
            console.log('Індекс IDX_events_isActive вже існує');
        }

        try {
            await queryRunner.createIndex("events", new TableIndex({
                name: "IDX_events_jobId",
                columnNames: ["jobId"]
            }));
        } catch (error) {
            console.log('Індекс IDX_events_jobId вже існує');
        }

        try {
            await queryRunner.createIndex("events", new TableIndex({
                name: "IDX_events_companyId",
                columnNames: ["companyId"]
            }));
        } catch (error) {
            console.log('Індекс IDX_events_companyId вже існує');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Видаляємо нові колонки
        const table = await queryRunner.getTable("events");
        if (table) {
            const columnsToRemove = [
                "notes", "status", "recurrenceType", "completionPercentage",
                "locationDetails", "externalAttendees", "isPrivate", "isActive",
                "completedAt", "cancelledAt", "cancellationReason",
                "jobId", "candidateId", "companyId"
            ];

            for (const columnName of columnsToRemove) {
                if (table.findColumnByName(columnName)) {
                    await queryRunner.dropColumn("events", columnName);
                }
            }
        }

        // Видаляємо індекси
        try {
            await queryRunner.dropIndex("events", "IDX_events_status");
        } catch (error) {
            console.log('Індекс IDX_events_status не існує');
        }

        try {
            await queryRunner.dropIndex("events", "IDX_events_isActive");
        } catch (error) {
            console.log('Індекс IDX_events_isActive не існує');
        }

        try {
            await queryRunner.dropIndex("events", "IDX_events_jobId");
        } catch (error) {
            console.log('Індекс IDX_events_jobId не існує');
        }

        try {
            await queryRunner.dropIndex("events", "IDX_events_companyId");
        } catch (error) {
            console.log('Індекс IDX_events_companyId не існує');
        }
    }
}
