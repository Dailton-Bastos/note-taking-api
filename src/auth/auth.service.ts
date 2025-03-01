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
import { TwoFactorAuthenticationEntity } from "./entities/two-factor-authentication.entity"
import { TOTPService } from "src/common/totp/totp.service"
import { decodeBase64 } from "@oslojs/encoding"
import { TOTP_DIGITS, TOTP_INTERVAL_IN_SECONDS } from "src/common/constants"

enum Preferred2FAMethod {
	APP = "app",
	EMAIL = "email",
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
		@InjectRepository(TwoFactorAuthenticationEntity)
		private readonly twoFactorAuthenticationRepository: Repository<TwoFactorAuthenticationEntity>,
		private readonly tOtpService: TOTPService,
	) {
		this.jwtExpirationTimeInSeconds = this.jwtSettings.jwtTtl
		this.jwtRefreshExpirationTimeInSeconds = this.jwtSettings.jwtRefreshTtl
	}

	async signIn({
		email,
		password,
		code,
	}: RequestSignInDto): Promise<
		| ResponseSignInDto
		| { twoFactorAuthentication: boolean; preferred2FAMethod: string }
	> {
		const user = await this.usersService.getUserByEmail({ email })

		if (!user || !user.password) {
			throw new UnauthorizedException("Incorrect email or password")
		}

		if (!user.emailVerified) {
			throw new UnauthorizedException("Access Denied")
		}

		const passwordMatch = await this.hashingService.compare(
			user.password,
			password,
		)

		if (!passwordMatch) {
			throw new UnauthorizedException("Incorrect email or password")
		}

		if (!user.isTwoFactorAuthenticationEnabled) {
			return this.createTokens({ sub: user.id, email: user.email })
		}

		if (!code) {
			if (!user.preferred2FAMethod || user.preferred2FAMethod === "email") {
				// TODO send email with code
				await this.generateTokensService.generateTwoFactorAuthenticationToken({
					email,
				})
			}

			return {
				twoFactorAuthentication: true,
				preferred2FAMethod: user.preferred2FAMethod as Preferred2FAMethod,
			}
		}

		// Verify Code
		if (!user.preferred2FAMethod || user.preferred2FAMethod === "email") {
			return this.validateTwoFactorAuthenticationCode({
				code,
				email,
				userId: user.id,
			})
		}

		// Verify a TOTP Code with constant-time comparison.
		return this.validateTwoFactorAuthenticationTOTPCode({
			code,
			email,
			userId: user.id,
		})
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

		return this.generateTokensService.generateResetPasswordToken({ email })
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

	private async validateTwoFactorAuthenticationCode({
		code,
		email,
		userId,
	}: { code: string; email: string; userId: number }) {
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

		return this.createTokens({ sub: userId, email })
	}

	private async validateTwoFactorAuthenticationTOTPCode({
		code,
		userId,
		email,
	}: {
		code: string
		email: string
		userId: number
	}) {
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

		return this.createTokens({ sub: userId, email })
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
