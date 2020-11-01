import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddToOrphanageCollunmPendingApproval1604244901538 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("orphanages", new TableColumn({
                name: 'pendingApproval',
                type: 'boolean',
                isNullable: true,
                default: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('pendingApproval');
    }

}
