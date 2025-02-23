import { AbstractEntity } from "src/database/entities/abstract.entity"
import { Column, CreateDateColumn, Entity } from "typeorm"

@Entity({ name: "user" })
export class UserEntity extends AbstractEntity<UserEntity> {
	@Column({ unique: true })
	email: string

	@Column({ length: 255 })
	password: string

	@CreateDateColumn({ name: "email_verified", nullable: true })
	emailVerified?: Date

	@Column({ length: 100, nullable: true })
	name?: string
}
