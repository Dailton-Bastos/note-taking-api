import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Query,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { RequestSignInDto } from "./dto/request-signIn.dto"
import { RequestRefreshTokenDto } from "./dto/request-refresh-token.dto"
import { SetPublicRoute } from "src/common/decorators/set-public-route.decorator"
import { RequestEmailVerificationDto } from "./dto/request-email-verification.dto"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@SetPublicRoute()
	@HttpCode(HttpStatus.OK)
	@Post("login")
	async signIn(@Body() signInDto: RequestSignInDto) {
		return this.authService.signIn(signInDto)
	}

	@SetPublicRoute()
	@HttpCode(HttpStatus.OK)
	@Post("email-verification")
	async emailVerification(@Query() { token }: RequestEmailVerificationDto) {
		return this.authService.emailVerification({ token })
	}

	@HttpCode(HttpStatus.OK)
	@Post("refresh")
	async refreshToken(@Body() refreshTokenDto: RequestRefreshTokenDto) {
		return this.authService.refreshTokens(refreshTokenDto)
	}
}
