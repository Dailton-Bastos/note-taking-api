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
import { RequestResetPasswordDto } from "./dto/request-reset-password.dto"
import { RequestNewPasswordTokenDto } from "./dto/request-new-password-token.dto"
import { RequestNewPasswordDto } from "./dto/request-new-password.dto"

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

	@SetPublicRoute()
	@HttpCode(HttpStatus.OK)
	@Post("reset-password")
	async resetPassword(@Body() { email }: RequestResetPasswordDto) {
		return this.authService.resetPassword({ email })
	}

	@SetPublicRoute()
	@HttpCode(HttpStatus.OK)
	@Post("new-password")
	async newPassword(
		@Query() { token }: RequestNewPasswordTokenDto,
		@Body() { password }: RequestNewPasswordDto,
	) {
		return this.authService.newPassword({ token }, { password })
	}

	@HttpCode(HttpStatus.OK)
	@Post("refresh")
	async refreshToken(@Body() refreshTokenDto: RequestRefreshTokenDto) {
		return this.authService.refreshTokens(refreshTokenDto)
	}
}
