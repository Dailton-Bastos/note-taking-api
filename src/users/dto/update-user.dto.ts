import { PartialType } from "@nestjs/mapped-types"
import { RequestUserDto } from "./request-user.dto"
import { IsDate } from "class-validator"

export class UpdateUserDto extends PartialType(RequestUserDto) {
	@IsDate()
	emailVerified: Date
}
