import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { PasswordResetTokenEntity } from "src/database/entities/password-reset-token.entity"

export abstract class VerificationTokensProtocol {
	abstract getEmailVerificationTokenByEmail({
		email,
	}: { email: string }): Promise<EmailVerificationCodeEntity | null>

	abstract getEmailVerificationTokenByToken({
		token,
	}: { token: string }): Promise<EmailVerificationCodeEntity | null>

	abstract getPasswordResetTokenByEmail({
		email,
	}: { email: string }): Promise<PasswordResetTokenEntity | null>

	abstract getPasswordResetTokenByToken({
		token,
	}: { token: string }): Promise<PasswordResetTokenEntity | null>

	abstract getTwoFactorAuthenticationTokenByEmail({
		email,
	}: { email: string }): Promise<TwoFactorAuthenticationEntity | null>

	abstract getTwoFactorAuthenticationSecretByUserId({
		userId,
	}: { userId: number }): Promise<TwoFactorAuthenticationSecretEntity | null>
}
