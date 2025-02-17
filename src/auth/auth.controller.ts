import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { RequestSignInDto } from "./dto/request-signIn.dto"
import { RequestRefreshTokenDto } from "./dto/request-refresh-token.dto"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@Post("login")
	async signIn(@Body() signInDto: RequestSignInDto) {
		return this.authService.signIn(signInDto)
	}

	@HttpCode(HttpStatus.OK)
	@Post("refresh")
	async refreshToken(@Body() refreshTokenDto: RequestRefreshTokenDto) {
		return this.authService.refreshTokens(refreshTokenDto)
	}
}
