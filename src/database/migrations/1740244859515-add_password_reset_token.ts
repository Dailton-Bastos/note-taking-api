import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class AddPasswordResetToken1740244859515 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "password_reset_token",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "token",
						type: "text",
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
			"password_reset_token",
			new TableIndex({
				name: "idx_password_reset_token",
				columnNames: ["token"],
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropIndex(
			"password_reset_token",
			"idx_password_reset_token",
		)

		await queryRunner.dropTable("password_reset_token")
	}
}
