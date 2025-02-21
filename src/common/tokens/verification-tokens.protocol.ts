import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"

export abstract class VerificationTokensProtocol {
	abstract getEmailVerificationTokenByEmail({
		email,
	}: { email: string }): Promise<EmailVerificationCodeEntity | null>
}
