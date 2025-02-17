import { IsNotEmpty, IsString } from "class-validator"

export class RequestRefreshTokenDto {
	@IsString()
	@IsNotEmpty()
	token: string
}
