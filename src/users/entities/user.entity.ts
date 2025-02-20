import { AbstractEntity } from "src/database/AbstractEntity.entity"
import { Column, CreateDateColumn, Entity } from "typeorm"

@Entity({ name: "user" })
export class UserEntity extends AbstractEntity<UserEntity> {
	@Column({ unique: true })
	email: string

	@Column({ length: 255 })
	password: string

	@CreateDateColumn({ name: "email_verified" })
	emailVerified: Date
}
