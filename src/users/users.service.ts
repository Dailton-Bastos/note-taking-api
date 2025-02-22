import {
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "./entities/user.entity"
import { RequestUserDto } from "./dto/request-user.dto"
import { HashingService } from "src/common/hashing/hashing.service"
import { GenerateTokensProtocol } from "src/common/tokens/generate-tokens.protocol"
import { RequestUserByEmailDto } from "./dto/request-user-by-email.dto"
import type { Repository } from "typeorm"

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly hashingService: HashingService,
		private readonly generateTokensService: GenerateTokensProtocol,
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
}
