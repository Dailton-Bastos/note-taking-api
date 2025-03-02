import { PartialType } from "@nestjs/mapped-types"
import { RequestUserDto } from "./request-user.dto"
import {
	IsBoolean,
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator"

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

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(6)
	otp?: string
}
