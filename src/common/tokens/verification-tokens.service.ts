import { InjectRepository } from "@nestjs/typeorm"
import { VerificationTokensProtocol } from "./verification-tokens.protocol"
import type { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { PasswordResetTokenEntity } from "src/database/entities/password-reset-token.entity"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"
import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"

@Injectable()
export class VerificationTokensService extends VerificationTokensProtocol {
	constructor(
		@InjectRepository(EmailVerificationCodeEntity)
		private readonly emailVerificationCodeRepository: Repository<EmailVerificationCodeEntity>,
		@InjectRepository(PasswordResetTokenEntity)
		private readonly passwordResetTokenRepository: Repository<PasswordResetTokenEntity>,
		@InjectRepository(TwoFactorAuthenticationEntity)
		private readonly twoFactorAuthenticationRepository: Repository<TwoFactorAuthenticationEntity>,
		@InjectRepository(TwoFactorAuthenticationSecretEntity)
		private readonly twoFactorAuthenticationSecretRepository: Repository<TwoFactorAuthenticationSecretEntity>,
	) {
		super()
	}

	async getEmailVerificationTokenByEmail({
		email,
	}: { email: string }): Promise<EmailVerificationCodeEntity | null> {
		return this.emailVerificationCodeRepository.findOneBy({
			email,
		})
	}

	async getEmailVerificationTokenByToken({
		token,
	}: { token: string }): Promise<EmailVerificationCodeEntity | null> {
		return this.emailVerificationCodeRepository.findOneBy({ code: token })
	}

	async getPasswordResetTokenByEmail({
		email,
	}: { email: string }): Promise<PasswordResetTokenEntity | null> {
		return this.passwordResetTokenRepository.findOneBy({ email })
	}

	async getPasswordResetTokenByToken({
		token,
	}: { token: string }): Promise<PasswordResetTokenEntity | null> {
		return this.passwordResetTokenRepository.findOneBy({ token })
	}

	async getTwoFactorAuthenticationTokenByEmail({
		email,
	}: {
		email: string
	}): Promise<TwoFactorAuthenticationEntity | null> {
		return this.twoFactorAuthenticationRepository.findOneBy({ email })
	}

	async getTwoFactorAuthenticationSecretByUserId({
		userId,
	}: { userId: number }): Promise<TwoFactorAuthenticationSecretEntity | null> {
		return this.twoFactorAuthenticationSecretRepository.findOne({
			where: {
				userId,
			},
		})
	}
}
