import { Global, Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "src/users/entities/user.entity"

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
