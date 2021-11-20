import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddPidCamera1637432013090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "cameras",
            new TableColumn({
                name : "pid",
                "type" : "int",
                "default" : 0
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("cameras","pid");
    }

}
