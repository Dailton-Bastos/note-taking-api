import { UserEntity } from "src/users/entities/user.entity"
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm"

@Entity({ name: "email_verification_code" })
export class EmailVerificationCodeEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	code: string

	@Column()
	email: string

	@Column({ name: "user_id" })
	userId: number

	@CreateDateColumn({ name: "expires_at" })
	expiresAt: Date

	// Relations
	// A Email Verification Code is owned by only a single User
	@OneToOne(
		() => UserEntity,
		(user) => user.emailVerificationCode,
	)
	@JoinColumn({ name: "user_id" })
	user: Awaited<UserEntity>
}
