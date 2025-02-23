import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateTableTwoFactorAuthentication1740349344010
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "two_factor_authentication",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "email",
						type: "varchar",
						isUnique: true,
					},
					{
						name: "code",
						type: "varchar",
						length: "6",
						isUnique: true,
					},
					{
						name: "expires_at",
						type: "timestamp",
					},
				],
			}),
		)

		await queryRunner.createIndex(
			"two_factor_authentication",
			new TableIndex({
				name: "idx_two_factor_authentication",
				columnNames: ["code"],
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropIndex(
			"two_factor_authentication",
			"idx_two_factor_authentication",
		)

		await queryRunner.dropTable("two_factor_authentication")
	}
}
