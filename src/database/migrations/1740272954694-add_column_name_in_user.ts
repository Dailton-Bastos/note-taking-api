import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddColumnNameInUser1740272954694 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "name",
				type: "varchar",
				isNullable: true,
				length: "100",
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "name")
	}
}
