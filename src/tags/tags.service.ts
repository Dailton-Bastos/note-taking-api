import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { TagsEntity } from "./entities/tags.entity"
import { Repository } from "typeorm"
import { RequestTagDto } from "./dto/request-tag.dto"
import { REMOVE_SPACES_REGEX } from "src/common/constants"
import { RegexProtocol } from "src/common/utils/regex.protocol"

@Injectable()
export class TagsService {
	constructor(
		@InjectRepository(TagsEntity)
		private readonly tagsRepository: Repository<TagsEntity>,
		@Inject(REMOVE_SPACES_REGEX)
		private readonly removeSpacesRegex: RegexProtocol,
	) {}

	async create({ name, userId }: RequestTagDto): Promise<TagsEntity> {
		if (!userId) {
			throw new BadRequestException("User not found")
		}

		const existingTag = await this.tagsRepository.findOneBy({ userId, name })

		if (existingTag) {
			throw new ForbiddenException("Tag already exist")
		}

		const tagName = this.removeSpacesRegex.execute(name)

		const tag = this.tagsRepository.create({ name: tagName, userId })

		return this.tagsRepository.save(tag)
	}
}
