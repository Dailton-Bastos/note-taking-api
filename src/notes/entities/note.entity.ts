import { AbstractEntity } from "src/database/entities/abstract.entity"
import { TagsEntity } from "src/tags/entities/tags.entity"
import { UserEntity } from "src/users/entities/user.entity"
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToOne,
} from "typeorm"

@Entity({ name: "notes" })
export class NotesEntity extends AbstractEntity<NotesEntity> {
	@Column({ name: "user_id" })
	userId: number

	@Column({ length: 255, type: "varchar" })
	title: string

	@Column({ type: "text" })
	description: string

	@CreateDateColumn({ name: "archived_at", nullable: true })
	archivedAt: Date

	// Relations
	// A Note is owned by only a single User
	@OneToOne(
		() => UserEntity,
		(user) => user.twoFactorRecovery,
	)
	@JoinColumn({ name: "user_id" })
	user: Awaited<UserEntity>

	// A note has many tags
	@ManyToMany(
		() => TagsEntity,
		(tag) => tag.notes,
		{ onDelete: "NO ACTION", onUpdate: "NO ACTION" },
	)
	@JoinTable({
		name: "note_tags",
		joinColumn: {
			name: "note_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "tag_id",
			referencedColumnName: "id",
		},
	})
	tags?: TagsEntity[]
}
