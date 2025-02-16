import * as argon2 from "argon2"
import { HashingService } from "./hashing.service"

export class ArgonService extends HashingService {
	async hash(password: string): Promise<string> {
		return argon2.hash(password)
	}
}
