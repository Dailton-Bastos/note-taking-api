import { IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class RequestUserDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	password: string
}
