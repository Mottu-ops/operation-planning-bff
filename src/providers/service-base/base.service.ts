import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
	public readonly ADMIN_V2: string = process.env.ADMIN_V2 ?? 'http://localhost:5000/api/v2';

	constructor() {}

	returnBadRequestError(message: string): HttpException {
		return new HttpException(
			{
				status: HttpStatus.BAD_REQUEST,
				error: message,
			},
			HttpStatus.BAD_REQUEST
		);
	}
}
