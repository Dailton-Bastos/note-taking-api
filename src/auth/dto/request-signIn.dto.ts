import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator"

export class RequestSignInDto {
	@IsEmail()
	email: string

	@IsString()
	@IsNotEmpty()
	password: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(6)
	code?: string
}
