import { PickType } from "@nestjs/mapped-types"
import { RequestUserDto } from "src/users/dto/request-user.dto"

export class RequestNewPasswordDto extends PickType(RequestUserDto, [
	"password",
]) {}
