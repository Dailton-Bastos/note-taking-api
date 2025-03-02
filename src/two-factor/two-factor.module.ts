import { Global, Module } from "@nestjs/common"
import { TwoFactorService } from "./two-factor.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"
import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"
import { TwoFactorAuthenticationRecoveryEntity } from "./entities/two_factor_authentication_recovery.entity"
import { Base64Utils } from "src/common/utils/base64.utils"

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			TwoFactorAuthenticationEntity,
			TwoFactorAuthenticationSecretEntity,
			TwoFactorAuthenticationRecoveryEntity,
		]),
	],
	providers: [TwoFactorService, Base64Utils],
	exports: [TwoFactorService],
})
export class TwoFactorModule {}
