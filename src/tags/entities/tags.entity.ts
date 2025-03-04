import { AbstractEntity } from "src/database/entities/abstract.entity"
import { Column, Entity } from "typeorm"

@Entity({ name: "tags" })
export class TagsEntity extends AbstractEntity<TagsEntity> {
	@Column({ length: 50, unique: true })
	name: string

	@Column({ name: "user_id" })
	userId: number
}
