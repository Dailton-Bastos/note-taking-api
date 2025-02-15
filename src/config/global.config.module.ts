import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import globalConfig from "./global.config"

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
		}),
		ConfigModule.forFeature(globalConfig),
	],
})
export class GlobalConfigModule {}
