import {
	Column,
	CreateDateColumn,
	Entity,
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
}
