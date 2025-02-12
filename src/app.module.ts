import { Module } from "@nestjs/common"
import { AppService } from "./app.service"
import { DatabaseModule } from "./database/database.module"
import { GlobalConfigModule } from "./config/global.config"

@Module({
	imports: [GlobalConfigModule, DatabaseModule],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
