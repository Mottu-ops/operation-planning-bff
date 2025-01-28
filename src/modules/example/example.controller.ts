import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('example')
@ApiTags('example')
@ApiBearerAuth()
export class ExampleController {
	@Get('example')
	async getActivities() {
		return 'Teste';
	}
}
