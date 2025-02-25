import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableIndex,
} from "typeorm"

export class CreateTableTwoFactorAuthenticationSecret1740362177077
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "two_factor_authentication_secret",
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
						name: "secret",
						type: "varchar",
						length: "255",
						isUnique: true,
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
			"two_factor_authentication_secret",
			new TableIndex({
				name: "idx_two_factor_authentication_secret",
				columnNames: ["secret"],
			}),
		)

		await queryRunner.createForeignKey(
			"two_factor_authentication_secret",
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
		const table = await queryRunner.getTable("two_factor_authentication_secret")
		const foreignKey = table?.foreignKeys.find((fk) => {
			return fk.columnNames.indexOf("user_id") !== -1
		})

		if (foreignKey) {
			await queryRunner.dropForeignKey(
				"two_factor_authentication_secret",
				foreignKey,
			)
		}

		await queryRunner.dropIndex(
			"two_factor_authentication_secret",
			"idx_two_factor_authentication_secret",
		)

		await queryRunner.dropTable("two_factor_authentication_secret")
	}
}
