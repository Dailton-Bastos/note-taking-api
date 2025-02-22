import { IsString, IsEmail, IsNotEmpty } from "class-validator"

export class RequestUserByEmailDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}
