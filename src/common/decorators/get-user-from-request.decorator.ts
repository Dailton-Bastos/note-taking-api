import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { REQUEST_USER_PAYLOAD_KEY } from "../constants"

export const GetUserFromRequest = createParamDecorator(
	(_, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>()

		return request[REQUEST_USER_PAYLOAD_KEY]
	},
)
