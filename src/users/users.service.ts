import {
	ForbiddenException,
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
import type { Repository } from "typeorm"
import { UpdateUserDto } from "./dto/update-user.dto"
import { RequestTokenPayloadDto } from "src/auth/dto/request-token-payload.dto"
import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"
import { encodeBase64 } from "@oslojs/encoding"

enum Preferred2FAMethod {
	APP = "app",
	EMAIL = "email",
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
			await this.generateTokensService.generateEmailVerificationToken({
				email: newUser.email,
				userId: newUser.id,
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
	}): Promise<void> {
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

		const twoFactorAuthenticationSecret =
			this.generateTokensService.generateTwoFactorAuthenticationSecret()

		if (updateUserDto.preferred2FAMethod === "app") {
			const existingTwoFactorAuthenticationSecret =
				await this.getTwoFactorAuthenticationSecretByUserId({ id })

			if (!existingTwoFactorAuthenticationSecret) {
				const newSecret = this.twoFactorAuthenticationSecretRepository.create({
					userId: id,
					secret: encodeBase64(twoFactorAuthenticationSecret),
				})

				await this.twoFactorAuthenticationSecretRepository.save(newSecret)
			}
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

	async newEmailVerificationToken({ email }: RequestUserByEmailDto) {
		if (!email) {
			throw new UnauthorizedException("Missing email")
		}

		const existingUser = await this.getUserByEmail({ email })

		if (!existingUser) {
			throw new UnauthorizedException("Email does not exist")
		}

		return this.generateTokensService.generateEmailVerificationToken({
			email,
			userId: existingUser.id,
		})
	}

	async getUserByEmail({ email }: RequestUserByEmailDto) {
		if (!email) {
			throw new UnauthorizedException("Missing email")
		}

		return this.userRepository.findOneBy({ email })
	}

	async getUserById({ id }: { id: number }): Promise<UserEntity | null> {
		return this.userRepository.findOne({ where: { id } })
	}

	protected getTwoFactorAuthenticationSecretByUserId({
		id,
	}: { id: number }): Promise<TwoFactorAuthenticationSecretEntity | null> {
		return this.twoFactorAuthenticationSecretRepository.findOneBy({
			userId: id,
		})
	}
}
