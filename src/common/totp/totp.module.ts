import { Global, Module } from "@nestjs/common"
import { TOTPService } from "./totp.service"
import { OsloTOTPService } from "./oslo-totp.service"

@Global()
@Module({
	providers: [
		{
			provide: TOTPService,
			useClass: OsloTOTPService,
		},
	],
	exports: [TOTPService],
})
export class TOTPModule {}
