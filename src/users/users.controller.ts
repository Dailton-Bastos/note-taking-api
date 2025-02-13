import { Body, Controller, Post } from "@nestjs/common"
import { UsersService } from "./users.service"
import { RequestUserDto } from "./dto/request-user.dto"

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: RequestUserDto) {
		return this.usersService.create(createUserDto)
	}
}
