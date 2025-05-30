import {
	BadRequestException,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common"
import { Repository } from "typeorm"
import { UserEntity } from "src/users/entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { HashingService } from "src/common/hashing/hashing.service"
import jwtConfig from "src/config/jwt.config"
import { JwtService } from "@nestjs/jwt"
import type { ConfigType } from "@nestjs/config"
import type { RequestSignInDto } from "./dto/request-signIn.dto"
import type { ResponseSignInDto } from "./dto/response-signIn.dto"
import type { RequestRefreshTokenDto } from "./dto/request-refresh-token.dto"
import { RequestEmailVerificationDto } from "./dto/request-email-verification.dto"
import { VerificationTokensProtocol } from "src/common/tokens/verification-tokens.protocol"
import { UsersService } from "src/users/users.service"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { RequestResetPasswordDto } from "./dto/request-reset-password.dto"
import { GenerateTokensProtocol } from "src/common/tokens/generate-tokens.protocol"
import { RequestNewPasswordDto } from "./dto/request-new-password.dto"
import { PasswordResetTokenEntity } from "src/database/entities/password-reset-token.entity"
import { RequestNewPasswordTokenDto } from "./dto/request-new-password-token.dto"
import { TwoFactorService } from "src/two-factor/two-factor.service"
import { MailerQueuesService } from "src/common/producers/mailer.queues.service"

type Response = {
	status: "success" | "error" | null
	message?: string
}

@Injectable()
export class AuthService {
	private readonly jwtExpirationTimeInSeconds: number
	private readonly jwtRefreshExpirationTimeInSeconds: number

	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly hashingService: HashingService,
		@Inject(jwtConfig.KEY)
		private readonly jwtSettings: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
		private readonly verificationTokensService: VerificationTokensProtocol,
		private readonly usersService: UsersService,
		@InjectRepository(EmailVerificationCodeEntity)
		private readonly emailVerificationCodeRepository: Repository<EmailVerificationCodeEntity>,
		private readonly generateTokensService: GenerateTokensProtocol,
		@InjectRepository(PasswordResetTokenEntity)
		private readonly passwordResetTokenRepository: Repository<PasswordResetTokenEntity>,
		private readonly twoFactorService: TwoFactorService,
		private readonly mailerQueuesService: MailerQueuesService,
	) {
		this.jwtExpirationTimeInSeconds = this.jwtSettings.jwtTtl
		this.jwtRefreshExpirationTimeInSeconds = this.jwtSettings.jwtRefreshTtl
	}

	async signIn({
		email,
		password,
		code,
	}: RequestSignInDto): Promise<ResponseSignInDto | Response> {
		const user = await this.verifyUserBeforeSign({
			email,
			password,
		})

		if (!user.emailVerified) {
			const token =
				await this.generateTokensService.generateEmailVerificationToken({
					email: user.email,
					userId: user.id,
				})

			return this.mailerQueuesService.sendEmailVerification({
				email: user.email,
				token: token.code,
			})
		}

		if (!user.isTwoFactorAuthenticationEnabled) {
			return this.createTokens({ sub: user.id, email: user.email })
		}

		if (!code) {
			if (!user.preferred2FAMethod || user.preferred2FAMethod === "email") {
				const { code } =
					await this.generateTokensService.generateTwoFactorAuthenticationToken(
						{
							email,
						},
					)

				await this.mailerQueuesService.sendEmailAuthCode({ email, code })
			}

			return {
				status: "success",
				message: "twoFactorAuthentication",
			}
		}

		// Verify Code
		if (!user.preferred2FAMethod || user.preferred2FAMethod === "email") {
			await this.twoFactorService.validateTwoFactorAuthenticationCode({
				code,
				email,
			})

			return this.createTokens({ sub: user.id, email })
		}

		// Verify a TOTP Code with constant-time comparison.
		await this.twoFactorService.validateTwoFactorAuthenticationTOTPCode({
			code,
			userId: user.id,
		})

		return this.createTokens({ sub: user.id, email })
	}

	async twoFactorAuthenticationRecovery({
		email,
		password,
		code,
	}: RequestSignInDto): Promise<ResponseSignInDto> {
		if (!code) {
			throw new UnauthorizedException("Code is required")
		}

		const user = await this.verifyUserBeforeSign({
			email,
			password,
		})

		if (!user.isTwoFactorAuthenticationEnabled) {
			throw new UnauthorizedException("Two Factor Authentication is required")
		}

		if (user.preferred2FAMethod !== "app") {
			throw new UnauthorizedException(
				"Two Factor Authentication App is required",
			)
		}

		await this.twoFactorService.twoFactorAuthenticationRecovery({
			code,
			userId: user.id,
		})

		return this.createTokens({ sub: user.id, email })
	}

	async refreshTokens({ token }: RequestRefreshTokenDto) {
		try {
			const { sub } = await this.jwtService.verifyAsync(token)

			const user = await this.userRepository.findOneBy({ id: sub })

			if (!user) throw new Error("Access Denied")

			return this.createTokens({ sub, email: user.email })
		} catch (error) {
			throw new UnauthorizedException(error.message)
		}
	}

	async emailVerification({ token }: RequestEmailVerificationDto) {
		if (!token) {
			throw new UnauthorizedException("Missing token")
		}

		const existingToken =
			await this.verificationTokensService.getEmailVerificationTokenByToken({
				token,
			})

		if (!existingToken) {
			throw new UnauthorizedException("Token does not exist")
		}

		const hasExpiredToken = new Date(existingToken.expiresAt) < new Date()

		if (hasExpiredToken) {
			throw new UnauthorizedException("Token has expired")
		}

		const existingUser = await this.usersService.getUserByEmail({
			email: existingToken.email,
		})

		if (!existingUser) {
			throw new UnauthorizedException("Email does not exist")
		}

		const user = await this.userRepository.preload({
			id: existingUser.id,
			emailVerified: new Date(),
			email: existingToken.email,
		})

		if (!user) {
			throw new UnauthorizedException("User does not exist")
		}

		await this.emailVerificationCodeRepository.delete({ id: existingToken.id })

		return this.userRepository.save(user)
	}

	async resetPassword({ email }: RequestResetPasswordDto) {
		const existingUser = await this.usersService.getUserByEmail({ email })

		if (!existingUser) {
			throw new UnauthorizedException("Email does not exist")
		}

		const { token } =
			await this.generateTokensService.generateResetPasswordToken({ email })

		await this.mailerQueuesService.sendEmailResetPassword({
			email,
			token: token,
		})
	}

	async newPassword(
		{ token }: RequestNewPasswordTokenDto,
		{ password }: RequestNewPasswordDto,
	) {
		if (!token) {
			throw new UnauthorizedException("Missing token")
		}

		if (!password) {
			throw new BadRequestException("New password is required")
		}

		const existingToken =
			await this.verificationTokensService.getPasswordResetTokenByToken({
				token: token,
			})

		if (!existingToken) {
			throw new UnauthorizedException("Token does not exist")
		}

		const hasExpiredToken = new Date(existingToken.expiresAt) < new Date()

		if (hasExpiredToken) {
			throw new UnauthorizedException("Token has expired")
		}

		const existingUser = await this.usersService.getUserByEmail({
			email: existingToken.email,
		})

		if (!existingUser) {
			throw new UnauthorizedException("Email does not exist")
		}

		const hashedPassword = await this.hashingService.hash(password)

		await this.passwordResetTokenRepository.delete({ id: existingToken.id })

		await this.userRepository.update(
			{
				password: existingUser.password,
			},
			{
				password: hashedPassword,
			},
		)
	}

	private async verifyUserBeforeSign({
		email,
		password,
	}: { email: string; password: string }): Promise<UserEntity> {
		const user = await this.usersService.getUserByEmail({ email })

		if (!user || !user.password) {
			throw new UnauthorizedException("Incorrect email or password")
		}

		const passwordMatch = await this.hashingService.compare(
			user.password,
			password,
		)

		if (!passwordMatch) {
			throw new UnauthorizedException("Incorrect email or password")
		}

		return user
	}

	private async createTokens({
		sub,
		email,
	}: { sub: number; email: string }): Promise<ResponseSignInDto> {
		const accessTokenPromise = this.signJwtAsync<Partial<UserEntity>>({
			sub,
			expiresIn: this.jwtExpirationTimeInSeconds,
			payload: { email },
		})

		const refreshTokenPromise = this.signJwtAsync({
			sub,
			expiresIn: this.jwtRefreshExpirationTimeInSeconds,
		})

		const [accessToken, refreshToken] = await Promise.all([
			accessTokenPromise,
			refreshTokenPromise,
		])

		return {
			accessToken,
			refreshToken,
		}
	}

	private async signJwtAsync<T>({
		sub,
		expiresIn,
		payload,
	}: { sub: number; expiresIn: number; payload?: T }) {
		return await this.jwtService.signAsync(
			{
				sub,
				...payload,
			},
			{
				expiresIn,
			},
		)
	}
}
