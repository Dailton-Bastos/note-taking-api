import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class RequestSignInDto {
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	password: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	code?: string
}
