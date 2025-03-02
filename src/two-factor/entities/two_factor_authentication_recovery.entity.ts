import { AbstractEntity } from "src/database/entities/abstract.entity"
import { Column, Entity } from "typeorm"

@Entity({ name: "two_factor_authentication_recovery" })
export class TwoFactorAuthenticationRecoveryEntity extends AbstractEntity<TwoFactorAuthenticationRecoveryEntity> {
	@Column({ type: "simple-array", default: [] })
	code: string[]

	@Column({ name: "user_id", unique: true })
	userId: number
}
