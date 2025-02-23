import { PartialType } from "@nestjs/mapped-types"
import { RequestUserDto } from "./request-user.dto"
import { IsDate, IsOptional } from "class-validator"

export class UpdateUserDto extends PartialType(RequestUserDto) {
	@IsOptional()
	@IsDate()
	emailVerified: Date
}
