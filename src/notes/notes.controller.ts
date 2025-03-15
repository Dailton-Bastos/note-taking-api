import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common"
import { NotesService } from "./notes.service"
import { RequestNoteDto } from "./dto/request-note.dto"
import { UserId } from "src/common/decorators/user-id.decorator"
import { UpdateNoteDto } from "./dto/update-note.dto"
import { RequestTokenPayloadDto } from "src/auth/dto/request-token-payload.dto"
import { RequestTokenPayloadParam } from "src/auth/params/request-token-payload.param"

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

	@Get()
	async findAll(@UserId() userId: number) {
		return this.notesService.findAll(userId)
	}

	@Patch(":id")
	async update(
		@Param("id") id: number,
		@UserId() userId: number,
		@RequestTokenPayloadParam() tokenPayloadDto: RequestTokenPayloadDto,
		@Body() updateNoteDto: UpdateNoteDto,
	) {
		return this.notesService.update({
			id,
			userId,
			tokenPayloadDto,
			updateNoteDto,
		})
	}

	@Delete(":id")
	async delete(@Param("id") id: number, @UserId() userId: number) {
		return this.notesService.delete({ id, userId })
	}
}
