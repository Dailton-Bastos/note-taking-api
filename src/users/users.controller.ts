import { Body, Controller, Get, Post, Request } from "@nestjs/common"
import { UsersService } from "./users.service"
import { RequestUserDto } from "./dto/request-user.dto"
import { REQUEST_USER_PAYLOAD_KEY } from "src/common/constants"

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: RequestUserDto) {
		return this.usersService.create(createUserDto)
	}

	@Get("profile")
	getProfile(@Request() req: Request) {
		return req[REQUEST_USER_PAYLOAD_KEY]
	}
}
