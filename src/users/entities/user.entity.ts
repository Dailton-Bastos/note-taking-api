import { TwoFactorAuthenticationSecretEntity as TwoFactorSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"
import { AbstractEntity } from "src/database/entities/abstract.entity"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { NotesEntity } from "src/notes/entities/note.entity"
import { TagsEntity } from "src/tags/entities/tags.entity"
import { TwoFactorAuthenticationRecoveryEntity as TwoFactorRecoveryEntity } from "src/two-factor/entities/two_factor_authentication_recovery.entity"
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

	// Relations
	// User can have only a single Two Factor Recovery Code
	@OneToOne(
		() => TwoFactorRecoveryEntity,
		(recovery) => recovery.user,
	)
	twoFactorRecovery: TwoFactorRecoveryEntity

	// User can have only a single Email Verification Code
	@OneToOne(
		() => EmailVerificationCodeEntity,
		(code) => code.user,
	)
	emailVerificationCode: EmailVerificationCodeEntity

	// User can have only a single Two Factor Secret
	@OneToOne(
		() => TwoFactorSecretEntity,
		(secret) => secret.user,
	)
	twoFactorSecret: TwoFactorSecretEntity

	// User can have many tags
	@OneToMany(
		() => TagsEntity,
		(tags) => tags.user,
	)
	tags: TagsEntity[]

	// User can have many notes
	@OneToMany(
		() => NotesEntity,
		(note) => note.user,
	)
	notes: NotesEntity[]
}
