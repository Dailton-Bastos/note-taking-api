import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { NotesEntity } from "./entities/note.entity"
import { In, Repository } from "typeorm"
import { RequestNoteDto } from "./dto/request-note.dto"
import { TagsEntity } from "src/tags/entities/tags.entity"

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
				updatedAt: true,
				tags: {
					id: true,
					name: true,
				},
			},
		})
	}
}
