import { Body, Controller, Get, Post, Request } from "@nestjs/common"
import { UsersService } from "./users.service"
import { RequestUserDto } from "./dto/request-user.dto"
import { REQUEST_USER_PAYLOAD_KEY } from "src/common/constants"
import { SetPublicRoute } from "src/common/decorators/set-public-route.decorator"
import { RequestUserByEmailDto } from "./dto/request-user-by-email.dto"

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async create(@Body() createUserDto: RequestUserDto) {
		return this.usersService.create(createUserDto)
	}

	@SetPublicRoute()
	@Post("new-email-verification")
	async newEmailVerification(@Body() { email }: RequestUserByEmailDto) {
		return this.usersService.newEmailVerificationToken({ email })
	}

	@Get("profile")
	getProfile(@Request() req: Request) {
		return req[REQUEST_USER_PAYLOAD_KEY]
	}
}
