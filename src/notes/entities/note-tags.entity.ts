import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { NotesEntity } from "./note.entity"
import { TagsEntity } from "src/tags/entities/tags.entity"

@Entity({ name: "note_tags" })
export class NoteTagsEntity {
	@PrimaryColumn({ name: "note_id" })
	noteId: number

	@PrimaryColumn({ name: "tag_id" })
	tagId: number

	@ManyToOne(
		() => NotesEntity,
		(note) => note.tags,
		{
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn([
		{
			name: "note_id",
			referencedColumnName: "id",
		},
	])
	notes: NotesEntity[]

	@ManyToOne(
		() => TagsEntity,
		(tag) => tag.notes,
		{
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		},
	)
	@JoinColumn([
		{
			name: "tag_id",
			referencedColumnName: "id",
		},
	])
	tags: TagsEntity[]
}
