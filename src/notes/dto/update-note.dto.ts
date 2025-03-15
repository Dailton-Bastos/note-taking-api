import { PartialType } from "@nestjs/mapped-types"
import { RequestNoteDto } from "./request-note.dto"
import { IsDateString, IsOptional } from "class-validator"

export class UpdateNoteDto extends PartialType(RequestNoteDto) {
	@IsOptional()
	@IsDateString()
	archivedAt?: Date
}
