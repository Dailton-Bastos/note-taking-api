import {
	MigrationInterface,
	QueryRunner,
	TableColumn,
	TableIndex,
} from "typeorm"

export class AddUniqueEmailInUser1739672402884 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn(
			"user",
			"email",
			new TableColumn({
				name: "email",
				type: "varchar",
				isUnique: true,
			}),
		)

		await queryRunner.createIndex(
			"user",
			new TableIndex({
				name: "User_email_key",
				columnNames: ["email"],
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn(
			"user",
			"email",
			new TableColumn({
				name: "email",
				type: "varchar",
				isNullable: true,
				isUnique: false,
			}),
		)
	}
}
