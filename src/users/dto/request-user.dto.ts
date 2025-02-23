import {
	IsString,
	IsEmail,
	IsNotEmpty,
	MinLength,
	MaxLength,
	IsOptional,
} from "class-validator"

export class RequestUserDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	password: string

	@IsOptional()
	@IsString()
	@MinLength(3)
	@MaxLength(100)
	name: string
}
