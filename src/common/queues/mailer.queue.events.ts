import {
	OnQueueEvent,
	QueueEventsListener,
	QueueEventsHost,
} from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { MAILER_REGISTER_QUEUE } from "../constants"

@QueueEventsListener(MAILER_REGISTER_QUEUE)
export class MailerQueueEventsListener extends QueueEventsHost {
	logger = new Logger("Queue")

	@OnQueueEvent("added")
	onAdded({ name }: { name: string }) {
		this.logger.log(`Job ${name} has been added to the queue`)
	}

	@OnQueueEvent("active")
	onActive({ jobId }: { jobId: string }) {
		this.logger.log(`Job with ID ${jobId} is ACTIVE!`)
	}

	@OnQueueEvent("progress")
	onProgress({ jobId }: { jobId: string }) {
		this.logger.log(`Job with ID ${jobId} is in PROGRESS!`)
	}

	@OnQueueEvent("failed")
	onFailed({ jobId }: { jobId: string }) {
		this.logger.log(`Job with ID ${jobId} FAILED!`)
	}

	@OnQueueEvent("completed")
	onCompleted({ jobId }: { jobId: string }) {
		this.logger.log(
			`✨ Congratulations job with ID ${jobId} successful COMPLETED! ✨`,
		)
	}
}
