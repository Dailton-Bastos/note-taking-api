import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { AppService } from "./app.service"
import { databaseConfig } from "./config/database.config"
import { GlobalConfigModule } from "./config/global.config"

import type { ConfigType } from "@nestjs/config"

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule.forFeature(databaseConfig)],
			inject: [databaseConfig.KEY],
			useFactory: async (
				databaseSettings: ConfigType<typeof databaseConfig>,
			) => ({ ...databaseSettings }),
		}),
		GlobalConfigModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
