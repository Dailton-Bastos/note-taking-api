import { Global, Module } from "@nestjs/common"
import { TwoFactorService } from "./two-factor.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"
import { TwoFactorAuthenticationSecretEntity } from "src/auth/entities/two-factor-authentication-secret.entity"

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			TwoFactorAuthenticationEntity,
			TwoFactorAuthenticationSecretEntity,
		]),
	],
	providers: [TwoFactorService],
	exports: [TwoFactorService],
})
export class TwoFactorModule {}
