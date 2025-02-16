import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class RequestSignInDto {
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	password: string
}
