import { Controller, Post } from "@nestjs/common"
import { TwoFactorService } from "./two-factor.service"
import { GetUserFromRequest } from "src/common/decorators/get-user-from-request.decorator"
import { UserEntity } from "src/users/entities/user.entity"

@Controller("two-factor")
export class TwoFactorController {
	constructor(private readonly twoFactorService: TwoFactorService) {}

	@Post("generate-new-recovery-codes")
	async generateNewRecoveryCodes(@GetUserFromRequest() user: UserEntity) {
		return this.twoFactorService.generateNewRecoveryCodes(user)
	}
}
