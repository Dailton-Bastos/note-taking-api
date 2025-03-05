import { AbstractEntity } from "src/database/entities/abstract.entity"
import { NotesEntity } from "src/notes/entities/note.entity"
import { UserEntity } from "src/users/entities/user.entity"
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm"

@Entity({ name: "tags" })
export class TagsEntity extends AbstractEntity<TagsEntity> {
	@Column({ length: 50, unique: true })
	name: string

	@Column({ name: "user_id" })
	userId: number

	// Relations
	// A Tag is owned by only a single User
	@ManyToOne(
		() => UserEntity,
		(user) => user.tags,
	)
	@JoinColumn({ name: "user_id" })
	user: Awaited<UserEntity>

	// A tag is owned by many notes
	@ManyToMany(
		() => NotesEntity,
		(note) => note.tags,
		{ onDelete: "NO ACTION", onUpdate: "NO ACTION" },
	)
	notes?: NotesEntity[]
}
