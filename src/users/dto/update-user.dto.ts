import { PartialType } from "@nestjs/mapped-types"
import { RequestUserDto } from "./request-user.dto"
import { IsBoolean, IsDate, IsEnum, IsOptional } from "class-validator"

enum Preferred2FAMethod {
	APP = "app",
	EMAIL = "email",
}

export class UpdateUserDto extends PartialType(RequestUserDto) {
	@IsOptional()
	@IsDate()
	emailVerified: Date

	@IsOptional()
	@IsBoolean()
	isTwoFactorAuthenticationEnabled: boolean

	@IsOptional()
	@IsEnum(Preferred2FAMethod)
	preferred2FAMethod: Preferred2FAMethod | null
}
