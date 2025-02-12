import { ConfigService } from "@nestjs/config"
import { DataSource } from "typeorm"
import { config } from "dotenv"

type DataBaseDataSource = {
	DATABASE_TYPE: string
	DATABASE_MIGRATION_HOST: string
	DATABASE_PORT: number
	DATABASE_USERNAME: string
	DATABASE_PASSWORD: string
	DATABASE_DATABASE: string
}

config()

const configService = new ConfigService<DataBaseDataSource>()

export default new DataSource({
	type: "postgres",
	host: configService.get("DATABASE_MIGRATION_HOST"),
	port: configService.get("DATABASE_PORT"),
	username: configService.get("DATABASE_USERNAME"),
	password: configService.get("DATABASE_PASSWORD"),
	database: configService.get("DATABASE_DATABASE"),
	migrations: ["src/database/migrations/*.ts"],
})
