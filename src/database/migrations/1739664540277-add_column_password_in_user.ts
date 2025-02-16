import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddColumnPasswordInUser1739657006338
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "password",
				type: "varchar",
				isNullable: false,
				length: "255",
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "password")
	}
}
