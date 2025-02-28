import { Module } from "@nestjs/common"
import { AppService } from "./app.service"
import { DatabaseModule } from "./database/database.module"
import { UsersModule } from "./users/users.module"
import { GlobalConfigModule } from "./config/global.config.module"
import { APP_FILTER, APP_GUARD } from "@nestjs/core"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"
import { AuthModule } from "./auth/auth.module"
import { HashingModule } from "./common/hashing/hashing.module"
import { AuthGuard } from "./common/guards/auth.guard"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./users/entities/user.entity"
import { TokensModule } from "./common/tokens/tokens.module"
import { TOTPModule } from "./common/totp/totp.module"

@Module({
	imports: [
		GlobalConfigModule,
		DatabaseModule,
		UsersModule,
		AuthModule,
		HashingModule,
		TOTPModule,
		TokensModule,
		TypeOrmModule.forFeature([UserEntity]),
	],
	controllers: [],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
