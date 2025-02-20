import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableColumn,
	TableForeignKey,
	TableIndex,
} from "typeorm"

export class AddUserEmailVerification1740012785934
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "email_verified",
				isNullable: true,
				type: "timestamp",
			}),
		)

		await queryRunner.createTable(
			new Table({
				name: "email_verification_code",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "code",
						type: "text",
					},
					{
						name: "user_id",
						type: "int",
					},
					{
						name: "email",
						type: "varchar",
					},
					{
						name: "expires_at",
						type: "timestamp",
					},
				],
			}),
		)

		await queryRunner.createIndex(
			"email_verification_code",
			new TableIndex({
				name: "idx_email_verification_code",
				columnNames: ["code"],
			}),
		)

		await queryRunner.createForeignKey(
			"email_verification_code",
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
		const table = await queryRunner.getTable("email_verification_code")
		const foreignKey = table?.foreignKeys.find((fk) => {
			return fk.columnNames.indexOf("user_id") !== -1
		})

		if (foreignKey) {
			await queryRunner.dropForeignKey("email_verification_code", foreignKey)
		}

		await queryRunner.dropColumn("user", "email_verified")

		await queryRunner.dropIndex(
			"email_verification_code",
			"idx_email_verification_code",
		)

		await queryRunner.dropTable("email_verification_code")
	}
}
