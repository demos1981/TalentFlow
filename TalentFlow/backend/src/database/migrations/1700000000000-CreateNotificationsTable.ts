import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class CreateNotificationsTable1700000000000 implements MigrationInterface {
    name = 'CreateNotificationsTable1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "notifications",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "gen_random_uuid()"
                    },
                    {
                        name: "userId",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "message",
                        type: "text",
                        isNullable: false
                    },
                    {
                        name: "priority",
                        type: "varchar",
                        length: "20",
                        default: "'medium'",
                        isNullable: false
                    },
                    {
                        name: "isRead",
                        type: "boolean",
                        default: false,
                        isNullable: false
                    },
                    {
                        name: "metadata",
                        type: "jsonb",
                        isNullable: true
                    },
                    {
                        name: "isDeleted",
                        type: "boolean",
                        default: false,
                        isNullable: false
                    },
                    {
                        name: "createdAt",
                        type: "timestamp with time zone",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp with time zone",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false
                    },
                    {
                        name: "readAt",
                        type: "timestamp with time zone",
                        isNullable: true
                    },
                    {
                        name: "expiresAt",
                        type: "timestamp with time zone",
                        isNullable: true
                    }
                ]
            }),
            true
        );

        // Створення індексів
        await queryRunner.createIndex(
            "notifications",
            new TableIndex({
                name: "idx_notifications_user_id",
                columnNames: ["userId"]
            })
        );

        await queryRunner.createIndex(
            "notifications",
            new TableIndex({
                name: "idx_notifications_type",
                columnNames: ["type"]
            })
        );

        await queryRunner.createIndex(
            "notifications",
            new TableIndex({
                name: "idx_notifications_is_read",
                columnNames: ["isRead"]
            })
        );

        await queryRunner.createIndex(
            "notifications",
            new TableIndex({
                name: "idx_notifications_created_at",
                columnNames: ["createdAt"]
            })
        );

        await queryRunner.createIndex(
            "notifications",
            new TableIndex({
                name: "idx_notifications_user_read",
                columnNames: ["userId", "isRead"]
            })
        );

        // Додавання foreign key
        await queryRunner.createForeignKey(
            "notifications",
            new TableForeignKey({
                name: "fk_notifications_user",
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Видалення foreign key
        const table = await queryRunner.getTable("notifications");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("notifications", foreignKey);
        }

        // Видалення таблиці
        await queryRunner.dropTable("notifications");
    }
}
