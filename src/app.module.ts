import { Module } from "@nestjs/common"
import { AppService } from "./app.service"
import { DatabaseModule } from "./database/database.module"
import { GlobalConfigModule } from "./config/global.config"
import { UsersModule } from "./users/users.module"

@Module({
	imports: [GlobalConfigModule, DatabaseModule, UsersModule],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
