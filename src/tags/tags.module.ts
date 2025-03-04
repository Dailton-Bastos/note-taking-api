import { Module } from "@nestjs/common"
import { TagsService } from "./tags.service"
import { TagsController } from "./tags.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TagsEntity } from "./entities/tags.entity"
import { REMOVE_SPACES_REGEX } from "src/common/constants"
import { RemoveSpacesRegex } from "src/common/utils/remove-spaces.regex"

@Module({
	imports: [TypeOrmModule.forFeature([TagsEntity])],
	providers: [
		TagsService,
		{
			provide: REMOVE_SPACES_REGEX,
			useClass: RemoveSpacesRegex,
		},
	],
	controllers: [TagsController],
})
export class TagsModule {}
