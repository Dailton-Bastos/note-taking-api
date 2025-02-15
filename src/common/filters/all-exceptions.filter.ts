import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { SERVER_ERROR_MESSAGE } from "../constants"
import type { Request, Response } from "express"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name)
	private readonly configService = new ConfigService()

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()

		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()

		const isProduction =
			this.configService.get<string>("NODE_ENV") === "production"

		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR

		const httpMessage =
			exception instanceof HttpException
				? exception.message
				: SERVER_ERROR_MESSAGE

		const responseBody = {
			message: httpMessage,
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
		}

		this.logger.error(
			`Message: ${responseBody.message}, Status: ${responseBody.statusCode}`,
		)

		return response
			.status(httpStatus)
			.json(
				isProduction
					? { ...responseBody }
					: { ...responseBody, path: request.path },
			)
	}
}
