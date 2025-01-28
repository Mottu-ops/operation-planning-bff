import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	if (process.env.NODE_ENV === 'local') {
		await repl(AppModule);
	}
}
bootstrap();
