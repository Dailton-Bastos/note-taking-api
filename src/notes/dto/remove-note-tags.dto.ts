import { ArrayNotEmpty, IsNotEmpty, IsNumber } from "class-validator"

export class RemoveNoteTagsDto {
	@IsNotEmpty()
	@IsNumber()
	id: number

	@ArrayNotEmpty()
	@IsNumber({}, { each: true })
	tagsIds: number[]
}
