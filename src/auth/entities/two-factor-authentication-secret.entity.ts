import { AbstractEntity } from "src/database/entities/abstract.entity"
import { UserEntity } from "src/users/entities/user.entity"
import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm"

@Entity({ name: "two_factor_authentication_secret" })
export class TwoFactorAuthenticationSecretEntity extends AbstractEntity<TwoFactorAuthenticationSecretEntity> {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 255, unique: true })
	secret: string

	@Column({ name: "user_id", unique: true })
	userId: number

	// Relations
	// A Two Factor Authentication Secret is owned by only a single User
	@OneToOne(
		() => UserEntity,
		(user) => user.twoFactorSecret,
	)
	@JoinColumn({ name: "user_id" })
	user: Awaited<UserEntity>
}
