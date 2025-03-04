import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator"

export class RequestTagDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	@MinLength(3)
	name: string

	@IsOptional()
	@IsNumber()
	userId: number
}
