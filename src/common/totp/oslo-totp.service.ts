import { createTOTPKeyURI } from "@oslojs/otp"
import { TOTPService } from "./totp.service"

export class OsloTOTPService extends TOTPService {
	createTOTPKeyURI({
		issuer,
		accountName,
		key,
		periodInSeconds,
		digits,
	}: {
		issuer: string
		accountName: string
		key: Uint8Array
		periodInSeconds: number
		digits: number
	}): string {
		return createTOTPKeyURI(issuer, accountName, key, periodInSeconds, digits)
	}
}
