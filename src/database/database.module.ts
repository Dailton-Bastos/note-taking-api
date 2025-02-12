import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { databaseConfig } from "../config/database.config"

import type { ConfigType } from "@nestjs/config"

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule.forFeature(databaseConfig)],
			inject: [databaseConfig.KEY],
			useFactory: async (
				databaseSettings: ConfigType<typeof databaseConfig>,
			) => ({
				...databaseSettings,
				entities: ["src/**/*.entity{.js,.ts}"],
			}),
		}),
	],
})
export class DatabaseModule {}
