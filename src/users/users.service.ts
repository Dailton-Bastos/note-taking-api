import {
	ForbiddenException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "./entities/user.entity"
import { RequestUserDto } from "./dto/request-user.dto"
import { HashingService } from "src/common/hashing/hashing.service"
import { GenerateTokensProtocol } from "src/common/tokens/generate-tokens.protocol"
import { RequestUserByEmailDto } from "./dto/request-user-by-email.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { RequestTokenPayloadDto } from "src/auth/dto/request-token-payload.dto"
import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"
import { encodeBase64, encodeBase32UpperCase } from "@oslojs/encoding"
import { TOTPService } from "src/common/totp/totp.service"
import globalConfig from "src/config/global.config"
import { TOTP_DIGITS, TOTP_INTERVAL_IN_SECONDS } from "src/common/constants"
import type { Repository } from "typeorm"
import type { ConfigType } from "@nestjs/config"
import { TwoFactorService } from "src/two-factor/two-factor.service"
import { MailerQueuesService } from "src/common/producers/mailer.queues.service"

enum Preferred2FAMethod {
	APP = "app",
	EMAIL = "email",
}

type UpdateUserResponse = {
	twoFactorUri: string
	twoFactorCode: string
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly hashingService: HashingService,
		private readonly generateTokensService: GenerateTokensProtocol,
		@InjectRepository(TwoFactorAuthenticationSecretEntity)
		private readonly twoFactorAuthenticationSecretRepository: Repository<TwoFactorAuthenticationSecretEntity>,
		private readonly tOtpService: TOTPService,
		@Inject(globalConfig.KEY)
		private readonly globalSettings: ConfigType<typeof globalConfig>,
		private readonly twoFactorService: TwoFactorService,
		private readonly mailerQueuesService: MailerQueuesService,
	) {}

	async create(createUserDto: RequestUserDto) {
		const passwordHash = await this.hashingService.hash(createUserDto.password)

		const userData = {
			email: createUserDto.email,
			password: passwordHash,
		}

		const newUser = this.userRepository.create({ ...userData })

		await this.userRepository.save(newUser)

		try {
			const token =
				await this.generateTokensService.generateEmailVerificationToken({
					email: newUser.email,
					userId: newUser.id,
				})

			await this.mailerQueuesService.sendEmailVerification({
				email: newUser.email,
				token: token.code,
			})
		} catch (error) {
			await this.userRepository.delete({ id: newUser.id })

			throw new InternalServerErrorException(error.message)
		}

		return newUser
	}

	async update({
		id,
		updateUserDto,
		tokenPayloadDto,
	}: {
		id: number
		updateUserDto: UpdateUserDto
		tokenPayloadDto: RequestTokenPayloadDto
	}): Promise<UpdateUserResponse | undefined> {
		const user = await this.getUserById({ id })

		if (!user) {
			throw new NotFoundException("User not found")
		}

		if (user.id !== tokenPayloadDto.sub) {
			throw new ForbiddenException("Not allowed")
		}

		if (updateUserDto.password) {
			updateUserDto.password = await this.hashingService.hash(
				updateUserDto.password,
			)
		}

		const isTwoFactorAuthenticationEnabled =
			updateUserDto.isTwoFactorAuthenticationEnabled ||
			user.isTwoFactorAuthenticationEnabled

		if (updateUserDto.preferred2FAMethod && !isTwoFactorAuthenticationEnabled) {
			throw new ForbiddenException("TwoFactorAuthenticationEnabled is required")
		}

		if (isTwoFactorAuthenticationEnabled && !updateUserDto.preferred2FAMethod) {
			updateUserDto.preferred2FAMethod = "email" as Preferred2FAMethod
		}

		if (updateUserDto.preferred2FAMethod === "app") {
			if (!updateUserDto.otp) {
				const twoFactorAuthenticationSecret =
					this.generateTokensService.generateTwoFactorAuthenticationSecret()

				const existingTwoFactorAuthenticationSecret =
					await this.twoFactorService.getTwoFactorAuthenticationSecretByUserId({
						userId: id,
					})

				if (!existingTwoFactorAuthenticationSecret) {
					const newSecret = this.twoFactorAuthenticationSecretRepository.create(
						{
							userId: id,
							secret: encodeBase64(twoFactorAuthenticationSecret),
						},
					)

					await this.twoFactorAuthenticationSecretRepository.save(newSecret)
				}

				const twoFactorUri = this.tOtpService.createTOTPKeyURI({
					issuer: this.globalSettings.totpIssuer,
					accountName: user.email,
					key: twoFactorAuthenticationSecret,
					periodInSeconds: TOTP_INTERVAL_IN_SECONDS,
					digits: TOTP_DIGITS,
				})

				const twoFactorCode = encodeBase32UpperCase(
					twoFactorAuthenticationSecret,
				)

				return {
					twoFactorUri,
					twoFactorCode,
				}
			}

			// Verify a TOTP Code with constant-time comparison.
			await this.twoFactorService.validateTwoFactorAuthenticationTOTPCode({
				code: updateUserDto.otp,
				userId: id,
			})

			// Generate recovery codes
			await this.twoFactorService.generateTwoFactorAuthenticationRecoveryCode({
				userId: id,
			})
		}

		await this.userRepository.update(
			{
				id,
			},
			{
				name: updateUserDto.name,
				password: updateUserDto.password,
				isTwoFactorAuthenticationEnabled:
					updateUserDto.isTwoFactorAuthenticationEnabled,
				preferred2FAMethod:
					updateUserDto.preferred2FAMethod as Preferred2FAMethod,
			},
		)
	}

	async delete({
		id,
		tokenPayload,
	}: { id: number; tokenPayload: RequestTokenPayloadDto }): Promise<void> {
		const user = await this.getUserById({ id })

		if (!user) {
			throw new NotFoundException("User not found")
		}

		if (user.id !== tokenPayload.sub) {
			throw new ForbiddenException("Not allowed")
		}

		await this.userRepository.remove(user)
	}

	async newEmailVerificationToken({ email }: RequestUserByEmailDto) {
		if (!email) {
			throw new UnauthorizedException("Missing email")
		}

		const existingUser = await this.getUserByEmail({ email })

		if (!existingUser) {
			throw new UnauthorizedException("Email does not exist")
		}

		const token =
			await this.generateTokensService.generateEmailVerificationToken({
				email,
				userId: existingUser.id,
			})

		await this.mailerQueuesService.sendEmailVerification({
			email: email,
			token: token.code,
		})
	}

	async getUserByEmail({ email }: RequestUserByEmailDto) {
		if (!email) {
			throw new UnauthorizedException("Missing email")
		}

		return this.userRepository.findOneBy({ email })
	}

	async getUserById({ id }: { id: number }): Promise<UserEntity | null> {
		return this.userRepository.findOneBy({ id })
	}
}
