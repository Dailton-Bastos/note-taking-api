import { AbstractEntity } from "src/database/entities/abstract.entity"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "two_factor_authentication_secret" })
export class TwoFactorAuthenticationSecretEntity extends AbstractEntity<TwoFactorAuthenticationSecretEntity> {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 255, unique: true })
	secret: string

	@Column({ name: "user_id", unique: true })
	userId: number
}
