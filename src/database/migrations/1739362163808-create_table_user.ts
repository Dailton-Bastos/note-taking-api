import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableUser1739362163808 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "user",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
					},
					{
						name: "email",
						type: "varchar",
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
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("user")
	}
}
