import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bullmq"
import { ConfigModule, ConfigType } from "@nestjs/config"
import redisConfig from "src/config/redis.config"

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule.forFeature(redisConfig)],
			inject: [redisConfig.KEY],
			useFactory: async ({ host, port }: ConfigType<typeof redisConfig>) => ({
				connection: {
					host,
					port,
				},
			}),
		}),
	],
})
export class BullMQModule {}
