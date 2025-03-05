import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableIndex,
} from "typeorm"
import { DatabaseConstraintsUtils } from "../utils/database-constraints.utils"

export class CreateTableNoteTags1741134968582 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "note_tags",
				columns: [
					{
						name: "note_id",
						type: "int",
					},
					{
						name: "tag_id",
						type: "int",
					},
				],
			}),
		)

		const noteForeignKey = new TableForeignKey({
			columnNames: ["note_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "notes",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		})

		const tagForeignKey = new TableForeignKey({
			columnNames: ["tag_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "tags",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		})

		await queryRunner.createPrimaryKey("note_tags", ["note_id", "tag_id"])

		await queryRunner.createForeignKeys("note_tags", [
			noteForeignKey,
			tagForeignKey,
		])

		await queryRunner.createIndex(
			"note_tags",
			new TableIndex({
				name: "idx_note_tags",
				columnNames: ["note_id", "tag_id"],
			}),
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const databaseUtils = new DatabaseConstraintsUtils(queryRunner)

		await queryRunner.dropPrimaryKey("note_tags")

		await databaseUtils.dropForeignKeys({
			tableName: "note_tags",
			columnNames: ["note_id", "tag_id"],
		})

		await queryRunner.dropIndex("note_tags", "idx_note_tags")

		await queryRunner.dropTable("note_tags")
	}
}
