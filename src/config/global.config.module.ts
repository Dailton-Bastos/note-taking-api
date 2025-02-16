import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import Joi from "joi"
import globalConfig from "./global.config"
import { databaseSchema } from "src/schema/database.schema"
import { jwtSchema } from "src/schema/jwt.schema"

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			validationSchema: Joi.object({
				...databaseSchema,
				...jwtSchema,
			}),
		}),
		ConfigModule.forFeature(globalConfig),
	],
})
export class GlobalConfigModule {}
