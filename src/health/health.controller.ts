import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
@ApiExcludeController()
export class HealthController {
	constructor(
		private healthService: HealthCheckService,
		private http: HttpHealthIndicator
	) {}

	@Get()
	check() {
		return this.healthService.check([]);
	}

	@Get('startup')
	checkReadiness() {
		return this.healthService.check([]);
	}
}
