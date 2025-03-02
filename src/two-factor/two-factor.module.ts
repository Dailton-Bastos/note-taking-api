import { Global, Module } from "@nestjs/common"
import { TwoFactorService } from "./two-factor.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TwoFactorAuthenticationEntity } from "src/auth/entities/two-factor-authentication.entity"

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([TwoFactorAuthenticationEntity])],
	providers: [TwoFactorService],
	exports: [TwoFactorService],
})
export class TwoFactorModule {}
