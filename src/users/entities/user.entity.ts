import { AbstractEntity } from "src/database/AbstractEntity.entity"
import { Column, Entity } from "typeorm"

@Entity({ name: "user" })
export class UserEntity extends AbstractEntity<UserEntity> {
	@Column({ unique: true })
	email: string

	@Column({ length: 255 })
	password: string
}
