import { Module } from "@nestjs/common"
import { MailerModule as NestMailerModule } from "@nestjs-modules/mailer"
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
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
				preview: true,
				template: {
					dir: `${__dirname}/templates`,
					adapter: new HandlebarsAdapter(undefined, {
						inlineCssEnabled: true,
					}),
					options: {
						strict: true,
					},
				},
				options: {
					partials: {
						dir: `${__dirname}/partials`,
						options: {
							strict: true,
						},
					},
				},
			}),
		}),
	],
})
export class MailerModule {}
