import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableIndex,
} from "typeorm"

export class AddTwoFactorAuthenticationRecovery1740918829079
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "two_factor_authentication_recovery",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "user_id",
						type: "int",
						isUnique: true,
					},
					{
						name: "code",
						type: "varchar",
						isArray: true,
						default: "ARRAY[]::varchar[]",
					},
					{
						name: "created_at",
						type: "timestamp",
						default: "now()",
					},
					{
						name: "updated_at",
						type: "timestamp",
						default: "now()",
					},
				],
			}),
		)

		await queryRunner.createIndex(
			"two_factor_authentication_recovery",
			new TableIndex({
				name: "idx_two_factor_authentication_recovery",
				columnNames: ["code"],
			}),
		)

		await queryRunner.createForeignKey(
			"two_factor_authentication_recovery",
			new TableForeignKey({
				columnNames: ["user_id"],
				referencedColumnNames: ["id"],
				referencedTableName: "user",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable(
			"two_factor_authentication_recovery",
		)
		const foreignKey = table?.foreignKeys.find((fk) => {
			return fk.columnNames.indexOf("user_id") !== -1
		})

		if (foreignKey) {
			await queryRunner.dropForeignKey(
				"two_factor_authentication_recovery",
				foreignKey,
			)
		}

		await queryRunner.dropIndex(
			"two_factor_authentication_recovery",
			"idx_two_factor_authentication_recovery",
		)

		await queryRunner.dropTable("two_factor_authentication_recovery")
	}
}
