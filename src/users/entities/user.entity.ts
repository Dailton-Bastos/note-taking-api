import { AbstractEntity } from "src/database/entities/abstract.entity"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm"

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

	@OneToMany(
		() => EmailVerificationCodeEntity,
		(emailVerificationCode) => emailVerificationCode.userId,
	)
	emailVerificationCodes: EmailVerificationCodeEntity[]
}
