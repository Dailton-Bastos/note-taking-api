import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "./entities/user.entity"
import { RequestUserDto } from "./dto/request-user.dto"
import { HashingService } from "src/common/hashing/hashing.service"
import type { Repository } from "typeorm"

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly hashingService: HashingService,
	) {}

	async create(createUserDto: RequestUserDto) {
		const passwordHash = await this.hashingService.hash(createUserDto.password)

		const userData = {
			email: createUserDto.email,
			password: passwordHash,
		}

		const newUser = this.userRepository.create({ ...userData })

		return this.userRepository.save(newUser)
	}
}
