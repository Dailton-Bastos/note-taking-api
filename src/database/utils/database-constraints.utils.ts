import { QueryRunner, TableUnique } from "typeorm"

export class DatabaseConstraintsUtils {
	constructor(private readonly queryRunner: QueryRunner) {
		this.queryRunner = queryRunner
	}

	public async dropUniqueConstraints({
		tableName,
		columnNames,
	}: { tableName: string; columnNames: string[] }): Promise<void> {
		const table = await this.queryRunner.getTable(tableName)

		if (!table) return

		if (table.uniques) {
			for (const uniqueConstraint of table.uniques) {
				for (const columnName of columnNames) {
					if (uniqueConstraint.columnNames.includes(columnName)) {
						await this.queryRunner.dropUniqueConstraint(
							tableName,
							uniqueConstraint.name as string,
						)
					}
				}
			}
		}
	}

	public async createUniqueConstraint({
		tableName,
		columnNames,
	}: { tableName: string; columnNames: string[] }): Promise<void> {
		await this.queryRunner.createUniqueConstraint(
			tableName,
			new TableUnique({ columnNames }),
		)
	}

	public async dropForeignKeys({
		tableName,
		columnNames,
	}: { tableName: string; columnNames: string[] }): Promise<void> {
		const table = await this.queryRunner.getTable(tableName)

		if (!table?.foreignKeys) return

		for (const foreignKey of table.foreignKeys) {
			for (const columnName of columnNames) {
				if (foreignKey.columnNames.includes(columnName)) {
					await this.queryRunner.dropForeignKey(
						tableName,
						foreignKey.name as string,
					)
				}
			}
		}
	}
}
