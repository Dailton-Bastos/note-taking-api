import { Global, Module } from "@nestjs/common"
import { HashingService } from "./hashing.service"
import { ArgonService } from "./argon.service"

@Global()
@Module({
	providers: [
		{
			provide: HashingService,
			useClass: ArgonService,
		},
	],
	exports: [HashingService],
})
export class HashingModule {}
