import { IsNotEmpty, IsString } from "class-validator"

export class RequestEmailVerificationDto {
	@IsString()
	@IsNotEmpty()
	token: string
}
