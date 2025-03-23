import { Logger } from "@nestjs/common"
import { Processor, WorkerHost } from "@nestjs/bullmq"
import {
	MAILER_REGISTER_QUEUE,
	SEND_EMAIL_AUTH_CODE_QUEUE,
	SEND_EMAIL_VERIFICATION_QUEUE,
} from "../constants"
import { Job } from "bullmq"
import { MailerService } from "@nestjs-modules/mailer"

@Processor(MAILER_REGISTER_QUEUE)
export class MailerProcessor extends WorkerHost {
	constructor(private readonly mailerService: MailerService) {
		super()
	}

	logger = new Logger("Queue")

	async process(job: Job): Promise<void> {
		switch (job.name) {
			case SEND_EMAIL_AUTH_CODE_QUEUE:
				await this.mailerService.sendMail({
					to: job.data.email,
					subject: "2FA Code",
					template: "access_code",
					context: {
						code: job.data.code,
					},
				})

				break

			case SEND_EMAIL_VERIFICATION_QUEUE:
				break

			default:
				this.logger.log(`Unknown job name: ${job.name}`)
				break
		}
	}
}
