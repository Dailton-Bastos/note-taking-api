import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator"

export class RequestNoteDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	title: string

	@IsString()
	@IsNotEmpty()
	description: string

	@IsOptional()
	@IsArray()
	tagsIds?: number[]
}
