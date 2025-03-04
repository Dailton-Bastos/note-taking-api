import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { ParseIntIDPipe } from "./common/pipes/parse-int-id.pipe"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: false,
		}),

		new ParseIntIDPipe(),
	)

	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
