import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "src/users/entities/user.entity"
import { JwtService } from "@nestjs/jwt"

import {
	IS_PUBLIC_ROUTER_KEY,
	REQUEST_TOKEN_PAYLOAD_KEY,
	REQUEST_USER_PAYLOAD_KEY,
} from "../constants"

import type { Request } from "express"
import type { Repository } from "typeorm"
import { Reflector } from "@nestjs/core"

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly jwtService: JwtService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_ROUTER_KEY,
			[context.getHandler(), context.getClass()],
		)

		if (isPublicRoute) return true

		const request = context.switchToHttp().getRequest<Request>()

		const token = this.extractTokenFromHeader(request)

		if (!token) {
			throw new UnauthorizedException("Access Denied")
		}

		try {
			const payload = await this.jwtService.verifyAsync(token)

			const user = await this.userRepository.findOneBy({ id: payload.sub })

			if (!user) {
				throw new UnauthorizedException("Access Denied")
			}

			request[REQUEST_USER_PAYLOAD_KEY] = user

			request[REQUEST_TOKEN_PAYLOAD_KEY] = payload
		} catch (error) {
			throw new UnauthorizedException(error.message)
		}

		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request?.headers?.authorization?.split(" ") ?? []

		return type === "Bearer" ? token : undefined
	}
}
