import { Global, Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "src/users/entities/user.entity"
import { ConfigModule } from "@nestjs/config"
import jwtConfig from "src/config/jwt.config"
import { JwtModule } from "@nestjs/jwt"
import type { ConfigType } from "@nestjs/config"
import { UsersModule } from "src/users/users.module"
import { EmailVerificationCodeEntity } from "src/database/entities/email-verification-code.entity"
import { PasswordResetTokenEntity } from "src/database/entities/password-reset-token.entity"
import { TwoFactorModule } from "src/two-factor/two-factor.module"

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			EmailVerificationCodeEntity,
			PasswordResetTokenEntity,
		]),
		ConfigModule.forFeature(jwtConfig),
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule.forFeature(jwtConfig)],
			inject: [jwtConfig.KEY],
			useFactory: async ({
				secret,
				jwtTtl,
				issuer,
				audience,
			}: ConfigType<typeof jwtConfig>) => ({
				secret,
				signOptions: {
					audience,
					issuer,
					expiresIn: jwtTtl,
				},
			}),
		}),
		UsersModule,
		TwoFactorModule,
	],
	exports: [ConfigModule],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
