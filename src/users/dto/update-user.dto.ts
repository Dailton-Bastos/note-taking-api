import { PartialType } from "@nestjs/mapped-types"
import { RequestUserDto } from "./request-user.dto"
import { IsBoolean, IsDate, IsOptional } from "class-validator"

export class UpdateUserDto extends PartialType(RequestUserDto) {
	@IsOptional()
	@IsDate()
	emailVerified: Date

	@IsOptional()
	@IsBoolean()
	isTwoFactorAuthenticationEnabled: boolean
}
