export abstract class HashingService {
	abstract hash(password: string): Promise<string>
}
