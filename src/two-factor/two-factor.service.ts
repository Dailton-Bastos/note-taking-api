import { Injectable, UnauthorizedException } from "@nestjs/common"
import { VerificationTokensProtocol } from "src/common/tokens/verification-tokens.protocol"
import { TOTPService } from "src/common/totp/totp.service"
import { decodeBase64 } from "@oslojs/encoding"
import { TOTP_DIGITS, TOTP_INTERVAL_IN_SECONDS } from "src/common/constants"
import { InjectRepository } from "@nestjs/typeorm"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"
import { Repository } from "typeorm"
import crypto from "node:crypto"
import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"
import { TwoFactorAuthenticationRecoveryEntity } from "./entities/two_factor_authentication_recovery.entity"
import { Base64Utils } from "src/common/utils/base64.utils"

@Injectable()
export class TwoFactorService {
	constructor(
		private readonly tOtpService: TOTPService,
		private readonly verificationTokensService: VerificationTokensProtocol,
		@InjectRepository(TwoFactorAuthenticationEntity)
		private readonly twoFactorAuthenticationRepository: Repository<TwoFactorAuthenticationEntity>,
		@InjectRepository(TwoFactorAuthenticationSecretEntity)
		private readonly twoFactorAuthenticationSecretRepository: Repository<TwoFactorAuthenticationSecretEntity>,
		@InjectRepository(TwoFactorAuthenticationRecoveryEntity)
		private readonly twoFactorAuthenticationRecoveryRepository: Repository<TwoFactorAuthenticationRecoveryEntity>,
		private readonly base64Utils: Base64Utils,
	) {}

	async validateTwoFactorAuthenticationCode({
		code,
		email,
	}: {
		code: string
		email: string
	}): Promise<void> {
		const existingToken =
			await this.verificationTokensService.getTwoFactorAuthenticationTokenByEmail(
				{ email },
			)

		if (!existingToken) {
			throw new UnauthorizedException("Invalid code")
		}

		if (existingToken.code !== code) {
			throw new UnauthorizedException("Invalid code")
		}

		const hasExpiredToken = new Date(existingToken.expiresAt) < new Date()

		if (hasExpiredToken) {
			throw new UnauthorizedException("Code has expired")
		}

		await this.twoFactorAuthenticationRepository.delete({
			id: existingToken.id,
		})
	}

	async validateTwoFactorAuthenticationTOTPCode({
		code,
		userId,
	}: {
		code: string
		userId: number
	}): Promise<void> {
		const twoFactorAuthenticationSecret =
			await this.verificationTokensService.getTwoFactorAuthenticationSecretByUserId(
				{
					userId,
				},
			)

		if (!twoFactorAuthenticationSecret) {
			throw new UnauthorizedException("Invalid 2FA Secret")
		}

		const validTOTP = this.tOtpService.verifyTOTP({
			key: decodeBase64(twoFactorAuthenticationSecret.secret),
			intervalInSeconds: TOTP_INTERVAL_IN_SECONDS,
			digits: TOTP_DIGITS,
			otp: code,
		})

		if (!validTOTP) {
			throw new UnauthorizedException("The provided 2FA code was invalid")
		}
	}

	async getTwoFactorAuthenticationSecretByUserId({
		userId,
	}: { userId: number }): Promise<TwoFactorAuthenticationSecretEntity | null> {
		return this.twoFactorAuthenticationSecretRepository.findOneBy({
			userId,
		})
	}

	async getTwoFactorAuthenticationRecoveryCodeByUserId({
		userId,
	}: {
		userId: number
	}): Promise<TwoFactorAuthenticationRecoveryEntity | null> {
		return this.twoFactorAuthenticationRecoveryRepository.findOneBy({ userId })
	}

	async generateTwoFactorAuthenticationRecoveryCode({
		userId,
	}: { userId: number }): Promise<string[]> {
		const code = [...Array(16)]
			.map(() => {
				return this.base64Utils.encode(
					crypto.randomInt(100_000, 1_000_000).toString(),
				)
			})
			.join(",")

		const existingCodes =
			await this.getTwoFactorAuthenticationRecoveryCodeByUserId({ userId })

		if (existingCodes) {
			await this.twoFactorAuthenticationRecoveryRepository.delete({
				id: existingCodes.id,
			})
		}

		const recoveryCodes = this.twoFactorAuthenticationRecoveryRepository.create(
			{
				userId,
				code: [`{${code}}`],
			},
		)

		await this.twoFactorAuthenticationRecoveryRepository.save(recoveryCodes)

		return recoveryCodes.code.map((code) => this.base64Utils.decode(code))
	}
}
