import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common"
import { RequestTagDto } from "./dto/request-tag.dto"
import { UserId } from "src/common/decorators/user-id.decorator"
import { TagsService } from "./tags.service"
import { RequestTokenPayloadParam } from "src/auth/params/request-token-payload.param"
import { RequestTokenPayloadDto } from "src/auth/dto/request-token-payload.dto"

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

	@Delete(":id")
	async delete(
		@Param("id") id: number,
		@RequestTokenPayloadParam() tokenPayload: RequestTokenPayloadDto,
	) {
		return this.tagsService.delete({ id, tokenPayload })
	}
}
