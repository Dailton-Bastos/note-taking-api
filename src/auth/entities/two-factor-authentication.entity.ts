import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm"

@Entity({ name: "two_factor_authentication" })
export class TwoFactorAuthenticationEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 6, unique: true })
	code: string

	@Column({ unique: true })
	email: string

	@CreateDateColumn({ name: "expires_at" })
	expiresAt: Date
}
