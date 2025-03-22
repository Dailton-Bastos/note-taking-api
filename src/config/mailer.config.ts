import { registerAs } from "@nestjs/config"
import yn from "yn"

export default registerAs("mailer", () => ({
	host: process.env.MAILER_HOST,
	port: Number(process.env.MAILER_PORT),
	user: process.env.MAILER_USER,
	pass: process.env.MAILER_PASS,
	from: process.env.MAILER_FROM,
	secure: yn(process.env.MAILER_SECURE),
	ignoreTLS: yn(process.env.MAILER_IGNORE_TLS),
}))
