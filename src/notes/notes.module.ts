import { Module } from "@nestjs/common"
import { NotesService } from "./notes.service"
import { NotesController } from "./notes.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { NotesEntity } from "./entities/note.entity"
import { TagsEntity } from "src/tags/entities/tags.entity"
import { NoteTagsEntity } from "./entities/note-tags.entity"

@Module({
	imports: [
		TypeOrmModule.forFeature([NotesEntity, TagsEntity, NoteTagsEntity]),
	],
	providers: [NotesService],
	controllers: [NotesController],
})
export class NotesModule {}
