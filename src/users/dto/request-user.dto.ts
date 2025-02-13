import { IsString, IsEmail, IsNotEmpty } from "class-validator"

export class RequestUserDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}
