import { AbstractEntity } from "src/database/entities/abstract.entity"
import { UserEntity } from "src/users/entities/user.entity"
import { Column, Entity, JoinColumn, OneToOne } from "typeorm"

@Entity({ name: "two_factor_authentication_recovery" })
export class TwoFactorAuthenticationRecoveryEntity extends AbstractEntity<TwoFactorAuthenticationRecoveryEntity> {
	@Column({ type: "simple-array", default: [] })
	code: string[]

	@Column({ name: "user_id", unique: true })
	userId: number

	// Relations
	// A Two Factor Authentication Recovery Code is owned by only a single User
	@OneToOne(
		() => UserEntity,
		(user) => user.twoFactorRecovery,
	)
	@JoinColumn({ name: "user_id" })
	user: Awaited<UserEntity>
}
