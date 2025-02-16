import { Global, Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "src/users/entities/user.entity"
import { ConfigModule } from "@nestjs/config"
import jwtConfig from "src/config/jwt.config"

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		ConfigModule.forFeature(jwtConfig),
	],
	exports: [ConfigModule],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
