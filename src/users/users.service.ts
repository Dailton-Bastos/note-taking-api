import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "./entities/user.entity"
import { RequestUserDto } from "./dto/request-user.dto"
import type { Repository } from "typeorm"

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async create(createUserDto: RequestUserDto) {
		const userData = {
			email: createUserDto.email,
			password: createUserDto.password,
		}

		const newUser = this.userRepository.create({ ...userData })

		return this.userRepository.save(newUser)
	}
}
