import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bullmq"
import { MAILER_REGISTER_QUEUE } from "../constants"
import { MailerQueuesService } from "../producers/mailer.queues.service"
import { MailerProcessor } from "../consumers/mailer.processor"
import { MailerQueueEventsListener } from "./mailer.queue.events"

@Module({
	imports: [
		BullModule.registerQueue({
			name: MAILER_REGISTER_QUEUE,
		}),
	],
	providers: [MailerProcessor, MailerQueueEventsListener, MailerQueuesService],
	exports: [MailerQueuesService],
})
export class MailerQueueModule {}
