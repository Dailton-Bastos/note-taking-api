import { IsString, IsNotEmpty } from "class-validator"

export class RequestNewPasswordTokenDto {
	@IsString()
	@IsNotEmpty()
	token: string
}
