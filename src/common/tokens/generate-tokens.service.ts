import { GenerateTokensProtocol } from "./generate-tokens.protocol"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { VerificationTokensProtocol } from "./verification-tokens.protocol"
import { v4 as uuid4 } from "uuid"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { PasswordResetTokenEntity } from "src/database/entities/password-reset-token.entity"
import crypto from "node:crypto"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"

@Injectable()
export class GenerateTokensService extends GenerateTokensProtocol {
	constructor(
		@InjectRepository(EmailVerificationCodeEntity)
		private readonly emailVerificationCodeRepository: Repository<EmailVerificationCodeEntity>,
		private readonly verificationTokensService: VerificationTokensProtocol,
		@InjectRepository(PasswordResetTokenEntity)
		private readonly passwordResetTokenRepository: Repository<PasswordResetTokenEntity>,
		@InjectRepository(TwoFactorAuthenticationEntity)
		private readonly twoFactorAuthenticationRepository: Repository<TwoFactorAuthenticationEntity>,
	) {
		super()
	}

	async generateEmailVerificationToken({
		email,
		userId,
	}: { email: string; userId: number }) {
		const existingToken =
			await this.verificationTokensService.getEmailVerificationTokenByEmail({
				email,
			})

		if (existingToken) {
			await this.emailVerificationCodeRepository.delete({
				id: existingToken.id,
			})
		}

		const code = uuid4()
		const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1h

		const verificationToken = this.emailVerificationCodeRepository.create({
			userId,
			email,
			code,
			expiresAt,
		})

		return this.emailVerificationCodeRepository.save(verificationToken)
	}

	async generateResetPasswordToken({ email }: { email: string }) {
		const existingToken =
			await this.verificationTokensService.getPasswordResetTokenByEmail({
				email,
			})

		if (existingToken) {
			await this.passwordResetTokenRepository.delete({ id: existingToken.id })
		}

		const token = uuid4()
		const expiresAt = new Date(new Date().getTime() + 3600 * 1000) // 1h

		const resetPasswordToken = this.passwordResetTokenRepository.create({
			email,
			token,
			expiresAt,
		})

		return this.passwordResetTokenRepository.save(resetPasswordToken)
	}

	async generateTwoFactorAuthenticationToken({ email }: { email: string }) {
		const code = crypto.randomInt(100_000, 1_000_000).toString()

		const expiresAt = new Date(new Date().getTime() + 300_000) // 5m

		const existingToken =
			await this.verificationTokensService.getTwoFactorAuthenticationTokenByEmail(
				{ email },
			)

		if (existingToken) {
			await this.twoFactorAuthenticationRepository.delete({
				id: existingToken.id,
			})
		}

		const twoFactorAuthenticationToken =
			this.twoFactorAuthenticationRepository.create({
				email,
				code,
				expiresAt,
			})

		return this.twoFactorAuthenticationRepository.save(
			twoFactorAuthenticationToken,
		)
	}

	generateTwoFactorAuthenticationSecret(): Uint8Array<ArrayBuffer> {
		return crypto.getRandomValues(new Uint8Array(20))
	}
}
