import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
	@ApiProperty({ type: Boolean })
	error: boolean;

	@ApiProperty({ type: String })
	errorMessages?: string[];

	@ApiProperty({ type: String })
	stackTrace?: string;

	result: any;
}
