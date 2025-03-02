import { Injectable } from "@nestjs/common"

@Injectable()
export class Base64Utils {
	encode(value: string): string {
		return Buffer.from(value).toString("base64")
	}

	decode(value: string): string {
		return Buffer.from(value, "base64").toString("utf-8")
	}
}
