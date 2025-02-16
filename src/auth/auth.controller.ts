import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SignInDto } from "./dto/request-signIn.dto"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	async signIn(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto)
	}
}
