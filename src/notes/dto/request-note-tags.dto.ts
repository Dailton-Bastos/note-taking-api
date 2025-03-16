import { ArrayNotEmpty, IsNotEmpty, IsNumber } from "class-validator"

export class RequestNoteTagsDto {
	@IsNotEmpty()
	@IsNumber()
	id: number

	@ArrayNotEmpty()
	@IsNumber({}, { each: true })
	tagsIds: number[]
}
