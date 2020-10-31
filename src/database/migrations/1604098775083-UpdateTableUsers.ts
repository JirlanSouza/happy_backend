import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class UpdateTableUsers1604098775083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
                    name: "forgotToken",
                    type: "varchar",
                    isNullable: true
                })
            );
        await queryRunner.addColumn('users', new TableColumn({
                name: "expiresForgotToken",
                type: "bigserial",
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "forgotToken");
        await queryRunner.dropColumn("users", "expiresForgotToken");
    }

}
