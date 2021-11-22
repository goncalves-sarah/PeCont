import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddTotalCapacityLocation1637529227847 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "locations",
            new TableColumn({
                name : "total_capacity",
                "type" : "int",
                "default" : 0
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("locations","total_capacity");
    }

}
