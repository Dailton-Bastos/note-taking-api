import { PartialType } from "@nestjs/mapped-types"
import { RequestNoteDto } from "./request-note.dto"
import {
	ArrayNotEmpty,
	IsDateString,
	IsNumber,
	IsOptional,
} from "class-validator"

export class UpdateNoteDto extends PartialType(RequestNoteDto) {
	@IsOptional()
	@IsDateString()
	archivedAt?: Date

	@IsOptional()
	@ArrayNotEmpty()
	@IsNumber({}, { each: true })
	tagsIds: number[]
}
