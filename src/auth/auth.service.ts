import { Injectable } from "@nestjs/common"
import { SignInDto } from "./dto/request-signIn.dto"

@Injectable()
export class AuthService {
	async signIn({ email, password }: SignInDto): Promise<boolean> {
		return true
	}
}
