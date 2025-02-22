import { InjectRepository } from "@nestjs/typeorm"
import { VerificationTokensProtocol } from "./verification-tokens.protocol"
import type { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"

@Injectable()
export class VerificationTokensService extends VerificationTokensProtocol {
	constructor(
		@InjectRepository(EmailVerificationCodeEntity)
		private readonly emailVerificationCodeRepository: Repository<EmailVerificationCodeEntity>,
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
}
