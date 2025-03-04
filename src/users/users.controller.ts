import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Request,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { RequestUserDto } from "./dto/request-user.dto"
import { REQUEST_USER_PAYLOAD_KEY } from "src/common/constants"
import { SetPublicRoute } from "src/common/decorators/set-public-route.decorator"
import { RequestUserByEmailDto } from "./dto/request-user-by-email.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { RequestTokenPayloadParam } from "src/auth/params/request-token-payload.param"
import { RequestTokenPayloadDto } from "src/auth/dto/request-token-payload.dto"

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@SetPublicRoute()
	@Post()
	async create(@Body() createUserDto: RequestUserDto) {
		return this.usersService.create(createUserDto)
	}

	@SetPublicRoute()
	@Post("new-email-verification")
	async newEmailVerification(@Body() { email }: RequestUserByEmailDto) {
		return this.usersService.newEmailVerificationToken({ email })
	}

	@Patch(":id")
	async update(
		@Param("id") id: number,
		@Body() updateUserDto: UpdateUserDto,
		@RequestTokenPayloadParam() tokenPayloadDto: RequestTokenPayloadDto,
	) {
		return this.usersService.update({ id, updateUserDto, tokenPayloadDto })
	}

	@Delete(":id")
	async remove(
		@Param("id") id: number,
		@RequestTokenPayloadParam() tokenPayload: RequestTokenPayloadDto,
	) {
		return this.usersService.delete({ id, tokenPayload })
	}

	@Get("profile")
	getProfile(@Request() req: Request) {
		return req[REQUEST_USER_PAYLOAD_KEY]
	}
}
