import { Injectable } from "@nestjs/common"
import { Queue } from "bullmq"
import { InjectQueue } from "@nestjs/bullmq"
import {
	MAILER_REGISTER_QUEUE,
	SEND_EMAIL_AUTH_CODE_QUEUE,
	SEND_EMAIL_RESET_PASSWORD_QUEUE,
	SEND_EMAIL_VERIFICATION_QUEUE,
} from "../constants"

type SendEmailAuthCodeQueue = {
	email: string
	code: string
}

type SendEmailVerificationQueue = {
	email: string
	token: string
}

@Injectable()
export class MailerQueuesService {
	constructor(
		@InjectQueue(MAILER_REGISTER_QUEUE)
		private readonly mailerQueues: Queue,
	) {}

	async sendEmailAuthCode({
		email,
		code,
	}: SendEmailAuthCodeQueue): Promise<void> {
		await this.mailerQueues.add(SEND_EMAIL_AUTH_CODE_QUEUE, { email, code })
	}

	async sendEmailVerification({
		email,
		token,
	}: SendEmailVerificationQueue): Promise<void> {
		await this.mailerQueues.add(SEND_EMAIL_VERIFICATION_QUEUE, { email, token })
	}

	async sendEmailResetPassword({
		email,
		token,
	}: SendEmailVerificationQueue): Promise<void> {
		await this.mailerQueues.add(SEND_EMAIL_RESET_PASSWORD_QUEUE, {
			email,
			token,
		})
	}
}
