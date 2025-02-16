import { Global, Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "src/users/entities/user.entity"
import { ConfigModule } from "@nestjs/config"
import jwtConfig from "src/config/jwt.config"
import { JwtModule } from "@nestjs/jwt"
import type { ConfigType } from "@nestjs/config"

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
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
	],
	exports: [ConfigModule],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
