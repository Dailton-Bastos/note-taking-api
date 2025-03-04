import { MigrationInterface, QueryRunner } from "typeorm"
import { DatabaseConstraintsUtils } from "../utils/database-constraints.utils"

export class ChangeColumnNameInTags1741111009205 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const databaseConstraintsUtils = new DatabaseConstraintsUtils(queryRunner)

		await databaseConstraintsUtils.dropUniqueConstraints({
			tableName: "tags",
			columnNames: ["name"],
		})
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const databaseConstraintsUtils = new DatabaseConstraintsUtils(queryRunner)

		await databaseConstraintsUtils.createUniqueConstraint({
			tableName: "tags",
			columnNames: ["name"],
		})
	}
}
