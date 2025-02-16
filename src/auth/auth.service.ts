import { Injectable, UnauthorizedException } from "@nestjs/common"
import { SignInDto } from "./dto/request-signIn.dto"
import { Repository } from "typeorm"
import { UserEntity } from "src/users/entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { HashingService } from "src/common/hashing/hashing.service"

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly hashingService: HashingService,
	) {}

	async signIn({ email, password }: SignInDto): Promise<boolean> {
		const user = await this.userRepository.findOneBy({ email })

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

		return true
	}
}
