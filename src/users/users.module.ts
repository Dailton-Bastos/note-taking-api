import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./entities/user.entity"
import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"
import { ConfigModule } from "@nestjs/config"
import globalConfig from "src/config/global.config"
import { GlobalConfigModule } from "src/config/global.config.module"

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, TwoFactorAuthenticationSecretEntity]),
		ConfigModule.forFeature(globalConfig),
		GlobalConfigModule,
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
