import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"

export abstract class GenerateTokensProtocol {
	abstract generateEmailVerificationToken({
		email,
		userId,
	}: { email: string; userId: number }): Promise<EmailVerificationCodeEntity>
}
