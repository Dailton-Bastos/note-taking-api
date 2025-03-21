import { Global, Module } from "@nestjs/common"
import { GenerateTokensProtocol } from "./generate-tokens.protocol"
import { GenerateTokensService } from "./generate-tokens.service"
import { VerificationTokensProtocol } from "./verification-tokens.protocol"
import { VerificationTokensService } from "./verification-tokens.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { PasswordResetTokenEntity } from "src/database/entities/password-reset-token.entity"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"
import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			EmailVerificationCodeEntity,
			PasswordResetTokenEntity,
			TwoFactorAuthenticationEntity,
			TwoFactorAuthenticationSecretEntity,
		]),
	],
	providers: [
		{
			provide: GenerateTokensProtocol,
			useClass: GenerateTokensService,
		},
		{
			provide: VerificationTokensProtocol,
			useClass: VerificationTokensService,
		},
	],
	exports: [GenerateTokensProtocol, VerificationTokensProtocol],
})
export class TokensModule {}
