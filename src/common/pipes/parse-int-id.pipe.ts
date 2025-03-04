import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from "@nestjs/common"

@Injectable()
export class ParseIntIDPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata) {
		if (metadata.type !== "param" || metadata.data !== "id") return value

		const parsedValue = Number(value)

		if (Number.isNaN(parsedValue)) {
			throw new BadRequestException("ID must be a numeric string")
		}

		if (parsedValue <= 0) {
			throw new BadRequestException("ID must be longer than zero")
		}

		return parsedValue
	}
}
