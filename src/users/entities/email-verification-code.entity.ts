import { AbstractEntity } from "src/database/AbstractEntity.entity"
import { Column, CreateDateColumn, Entity } from "typeorm"

@Entity({ name: "email_verification_code" })
export class EmailVerificationCodeEntity extends AbstractEntity<EmailVerificationCodeEntity> {
	@Column()
	code: string

	@Column()
	email: string

	@Column({ name: "user_id" })
	userId: number

	@CreateDateColumn({ name: "expires_at" })
	expiresAt: Date
}
