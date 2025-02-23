import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddColumnTwoFactorAuthenticationInUser1740340887998
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "is_two_factor_authentication_enabled",
				type: "boolean",
				default: false,
				isNullable: true,
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "is_two_factor_authentication_enabled")
	}
}
