import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { Repository } from "typeorm"
import { UserEntity } from "src/users/entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { HashingService } from "src/common/hashing/hashing.service"
import jwtConfig from "src/config/jwt.config"
import { JwtService } from "@nestjs/jwt"
import type { ConfigType } from "@nestjs/config"
import type { RequestSignInDto } from "./dto/request-signIn.dto"
import type { ResponseSignInDto } from "./dto/response-signIn.dto"

@Injectable()
export class AuthService {
	private readonly jwtExpirationTimeInSeconds: number

	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly hashingService: HashingService,
		@Inject(jwtConfig.KEY)
		private readonly jwtSettings: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
	) {
		this.jwtExpirationTimeInSeconds = this.jwtSettings.jwtTtl
	}

	async signIn({
		email,
		password,
	}: RequestSignInDto): Promise<ResponseSignInDto> {
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

		const payload = {
			sub: user.id,
			email: user.email,
		}

		const accessToken = await this.jwtService.signAsync(payload)

		return {
			accessToken,
			expiresIn: this.jwtExpirationTimeInSeconds,
		}
	}
}
