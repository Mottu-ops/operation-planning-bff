import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	get() {
		return 'Welcome to operation-planning-bff 🔧';
	}
}
