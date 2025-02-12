import { AbstractEntity } from "src/database/AbstractEntity.entity"
import { Column, Entity } from "typeorm"

@Entity({ name: "user" })
export class UserEntity extends AbstractEntity<UserEntity> {
	@Column({ unique: true, nullable: false })
	email: string
}
