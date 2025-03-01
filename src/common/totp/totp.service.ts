export abstract class TOTPService {
	/**
	 * Generates a new TOTP with SHA-1
	 * @param issuer e.g. My App
	 * @param accountName Pass the website's name and the user identifier (e.g. email, username)
	 * @param key HMAC key
	 * @param periodInSeconds - Period In Seconds
	 * @param digits - Digits
	 * @returns {string}
	 */
	abstract createTOTPKeyURI({
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
	}): string

	/**
	 * Verifies a TOTP with constant-time comparison.
	 * @param key HMAC key
	 * @param intervalInSeconds - Interval In Seconds
	 * @param digits - Digits
	 * @param otp - TOTP Code
	 * @returns {string}
	 */
	abstract verifyTOTP({
		key,
		intervalInSeconds,
		digits,
		otp,
	}: {
		key: Uint8Array
		intervalInSeconds: number
		digits: number
		otp: string
	}): boolean
}
