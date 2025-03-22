import { Module } from "@nestjs/common"
import { MailerModule as NestMailerModule } from "@nestjs-modules/mailer"
import { ConfigModule, ConfigType } from "@nestjs/config"
import mailerConfig from "src/config/mailer.config"

@Module({
	imports: [
		NestMailerModule.forRootAsync({
			imports: [ConfigModule.forFeature(mailerConfig)],
			inject: [mailerConfig.KEY],
			useFactory: async (mailerSettings: ConfigType<typeof mailerConfig>) => ({
				transport: {
					host: mailerSettings.host,
					port: mailerSettings.port,
					ignoreTLS: mailerSettings.ignoreTLS,
					secure: mailerSettings.secure,
					auth: {
						user: mailerSettings.user,
						pass: mailerSettings.pass,
					},
				},
				defaults: {
					from: `No Reply ${mailerSettings.from}`,
				},
			}),
		}),
	],
})
export class MailerModule {}
