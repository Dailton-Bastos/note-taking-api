import { registerAs } from "@nestjs/config"

export default registerAs("globalConfig", () => ({
	environment: process.env.NODE_ENV || "development",
	totpIssuer: process.env.TOTP_ISSUER || "note-taking",
}))
