import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { PasswordResetTokenEntity } from "src/database/entities/password-reset-token.entity"

export abstract class GenerateTokensProtocol {
	abstract generateEmailVerificationToken({
		email,
		userId,
	}: { email: string; userId: number }): Promise<EmailVerificationCodeEntity>

	abstract generateResetPasswordToken({
		email,
	}: { email: string }): Promise<PasswordResetTokenEntity>

	abstract generateTwoFactorAuthenticationToken({
		email,
	}: {
		email: string
	}): Promise<TwoFactorAuthenticationEntity>
}
