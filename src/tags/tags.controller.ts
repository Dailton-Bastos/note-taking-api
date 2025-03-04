import { Body, Controller, Get, Post } from "@nestjs/common"
import { RequestTagDto } from "./dto/request-tag.dto"
import { UserId } from "src/common/decorators/user-id.decorator"
import { TagsService } from "./tags.service"

@Controller("tags")
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Post()
	async create(@Body() { name }: RequestTagDto, @UserId() id: number) {
		return this.tagsService.create({ name, userId: id })
	}

	@Get()
	async findAll(@UserId() id: number) {
		return this.tagsService.findAll(id)
	}
}
