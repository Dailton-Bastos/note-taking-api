import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm"

@Entity({ name: "password_reset_token" })
export class PasswordResetTokenEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	token: string

	@Column()
	email: string

	@CreateDateColumn({ name: "expires_at" })
	expiresAt: Date
}
