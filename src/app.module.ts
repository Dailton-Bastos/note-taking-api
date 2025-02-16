import { Module } from "@nestjs/common"
import { AppService } from "./app.service"
import { DatabaseModule } from "./database/database.module"
import { UsersModule } from "./users/users.module"
import { GlobalConfigModule } from "./config/global.config.module"
import { APP_FILTER } from "@nestjs/core"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"
import { AuthModule } from "./auth/auth.module"

@Module({
	imports: [GlobalConfigModule, DatabaseModule, UsersModule, AuthModule],
	controllers: [],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule {}
