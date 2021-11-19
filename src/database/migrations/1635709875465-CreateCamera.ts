import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCamera1635709875465 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cameras",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "location",
                        type: "uuid"
                    },
                    {
                        name: "status",
                        type: "int",
                        default: 0
                    },
                    {
                        name: "ip",
                        type: "varchar"
                    },
                    {
                        name: "user",
                        type: "uuid"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKUser",
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        columnNames: ["user"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL"
                    },
                    {
                        name: "FKLocation",
                        referencedTableName: "locations",
                        referencedColumnNames: ["id"],
                        columnNames: ["location"],
                        onDelete: "SET NULL",
                        onUpdate: "SET NULL"
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cameras");
    }


}
