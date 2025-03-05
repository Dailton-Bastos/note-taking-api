import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableIndex,
} from "typeorm"
import { DatabaseConstraintsUtils } from "../utils/database-constraints.utils"

export class CreateTableNotes1741132546213 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "notes",
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
					},
					{
						name: "title",
						type: "varchar",
						length: "255",
					},
					{
						name: "description",
						type: "text",
					},
					{
						name: "archived_at",
						type: "timestamp",
						isNullable: true,
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
			"notes",
			new TableIndex({
				name: "idx_notes",
				columnNames: ["title"],
			}),
		)

		await queryRunner.createForeignKey(
			"notes",
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
		const databaseUtils = new DatabaseConstraintsUtils(queryRunner)

		await databaseUtils.dropForeignKeys({
			tableName: "notes",
			columnNames: ["user_id"],
		})

		await queryRunner.dropIndex("notes", "idx_notes")

		await queryRunner.dropTable("notes")
	}
}
