import { Body, Controller, Post } from "@nestjs/common"
import { NotesService } from "./notes.service"
import { RequestNoteDto } from "./dto/request-note.dto"
import { UserId } from "src/common/decorators/user-id.decorator"

@Controller("notes")
export class NotesController {
	constructor(private readonly notesService: NotesService) {}

	@Post()
	async create(
		@Body() { title, description, tagsIds }: RequestNoteDto,
		@UserId() userId: number,
	) {
		return this.notesService.create(
			{
				title,
				description,
				tagsIds,
			},
			userId,
		)
	}
}
