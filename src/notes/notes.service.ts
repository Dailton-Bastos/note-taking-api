import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { NotesEntity } from "./entities/note.entity"
import { In, Repository } from "typeorm"
import { RequestNoteDto } from "./dto/request-note.dto"
import { TagsEntity } from "src/tags/entities/tags.entity"
import { UpdateNoteDto } from "./dto/update-note.dto"
import { RequestTokenPayloadDto } from "src/auth/dto/request-token-payload.dto"

@Injectable()
export class NotesService {
	constructor(
		@InjectRepository(NotesEntity)
		private readonly notesRepository: Repository<NotesEntity>,
		@InjectRepository(TagsEntity)
		private readonly tagsRepository: Repository<TagsEntity>,
	) {}

	async create(
		{ title, description, tagsIds = [] }: RequestNoteDto,
		userId: number,
	): Promise<NotesEntity> {
		const tags = await this.tagsRepository.findBy({ id: In(tagsIds), userId })

		const note = this.notesRepository.create({
			userId,
			title,
			description,
			tags,
		})

		return this.notesRepository.save(note)
	}

	async findAll(userId: number): Promise<NotesEntity[]> {
		return this.notesRepository.find({
			where: {
				userId,
			},
			relations: {
				tags: true,
			},
			order: { createdAt: "DESC" },
			select: {
				id: true,
				title: true,
				description: true,
				archivedAt: true,
				updatedAt: true,
				tags: {
					id: true,
					name: true,
				},
			},
		})
	}

	async update({
		id,
		userId,
		tokenPayloadDto,
		updateNoteDto,
	}: {
		id: number
		userId: number
		tokenPayloadDto: RequestTokenPayloadDto
		updateNoteDto: UpdateNoteDto
	}): Promise<void> {
		const note = await this.notesRepository.findOne({
			where: { id, userId },
		})

		if (!note) {
			throw new NotFoundException("Note not found")
		}

		if (note.userId !== tokenPayloadDto.sub) {
			throw new ForbiddenException("Not allowed")
		}

		await this.notesRepository.update(
			{ id },
			{
				title: updateNoteDto.title,
				description: updateNoteDto.description,
				archivedAt: updateNoteDto?.archivedAt,
			},
		)
	}

	async delete({ id, userId }: { id: number; userId: number }): Promise<void> {
		const note = await this.notesRepository.findOne({
			relations: {
				tags: true,
			},
			where: { id, userId },
		})

		if (!note) {
			throw new NotFoundException("Note not found")
		}

		note.tags = []

		await this.notesRepository.save(note)

		await this.notesRepository.delete({ id })
	}
}
