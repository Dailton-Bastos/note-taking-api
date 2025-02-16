import { Module } from "@nestjs/common"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./entities/user.entity"
import { HashingService } from "src/common/hashing/hashing.service"
import { ArgonService } from "src/common/hashing/argon.service"

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [UsersController],
	providers: [
		UsersService,
		{
			provide: HashingService,
			useClass: ArgonService,
		},
	],
	exports: [HashingService],
})
export class UsersModule {}
