import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { REQUEST_TOKEN_PAYLOAD_KEY } from "src/common/constants"
import type { Request } from "express"

export const RequestTokenPayloadParam = createParamDecorator(
	(_: unknown, ctx: ExecutionContext) => {
		const { getRequest } = ctx.switchToHttp()

		const request = getRequest<Request>()

		return request[REQUEST_TOKEN_PAYLOAD_KEY]
	},
)
