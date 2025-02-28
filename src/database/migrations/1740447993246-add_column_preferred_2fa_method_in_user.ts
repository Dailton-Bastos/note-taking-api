import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddColumnPreferred2faMethodInUser1740447993246
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "preferred_2fa_method",
				type: "enum",
				enum: ["app", "email"],
				default: null,
				isNullable: true,
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "preferred_2fa_method")
	}
}
