import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"
import { AbstractEntity } from "src/database/entities/abstract.entity"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne } from "typeorm"

enum Preferred2FAMethod {
	APP = "app",
	EMAIL = "email",
}

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

	@Column({
		name: "is_two_factor_authentication_enabled",
		default: false,
		nullable: true,
	})
	isTwoFactorAuthenticationEnabled?: boolean

	@Column({
		name: "preferred_2fa_method",
		type: "enum",
		enum: Preferred2FAMethod,
		default: null,
		nullable: true,
	})
	preferred2FAMethod?: Preferred2FAMethod

	@OneToMany(
		() => EmailVerificationCodeEntity,
		(emailVerificationCode) => emailVerificationCode.userId,
	)
	emailVerificationCodes: EmailVerificationCodeEntity[]

	@OneToOne(() => TwoFactorAuthenticationEntity)
	twoFactorAuthentication: TwoFactorAuthenticationEntity

	@OneToOne(() => TwoFactorAuthenticationSecretEntity)
	twoFactorAuthenticationSecret: TwoFactorAuthenticationSecretEntity
}
