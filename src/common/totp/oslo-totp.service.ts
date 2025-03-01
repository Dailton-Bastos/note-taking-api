import { createTOTPKeyURI, verifyTOTP } from "@oslojs/otp"
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

	verifyTOTP({
		key,
		intervalInSeconds,
		digits,
		otp,
	}: {
		key: Uint8Array
		intervalInSeconds: number
		digits: number
		otp: string
	}): boolean {
		return verifyTOTP(key, intervalInSeconds, digits, otp)
	}
}
