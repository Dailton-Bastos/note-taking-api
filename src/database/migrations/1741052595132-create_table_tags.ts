import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableIndex,
} from "typeorm"

export class CreateTableTags1741052595132 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "tags",
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
						name: "name",
						type: "varchar",
						length: "50",
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
			"tags",
			new TableIndex({
				name: "idx_tags",
				columnNames: ["name"],
			}),
		)

		await queryRunner.createForeignKey(
			"tags",
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
		const table = await queryRunner.getTable("tags")

		const foreignKey = table?.foreignKeys.find((fk) => {
			return fk.columnNames.indexOf("user_id") !== -1
		})

		if (foreignKey) {
			await queryRunner.dropForeignKey("tags", foreignKey)
		}

		await queryRunner.dropIndex("tags", "idx_tags")

		await queryRunner.dropTable("tags")
	}
}
