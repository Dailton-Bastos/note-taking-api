import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import * as Joi from "joi"
import globalConfig from "./global.config"

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			validationSchema: Joi.object({
				DATABASE_TYPE: Joi.required(),
				DATABASE_HOST: Joi.required(),
				DATABASE_PORT: Joi.number().default(5432),
				DATABASE_USERNAME: Joi.required(),
				DATABASE_DATABASE: Joi.required(),
				DATABASE_PASSWORD: Joi.required(),
				DATABASE_AUTOLOADENTITIES: Joi.number().min(0).max(1).default(0),
				DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
			}),
		}),
		ConfigModule.forFeature(globalConfig),
	],
})
export class GlobalConfigModule {}
