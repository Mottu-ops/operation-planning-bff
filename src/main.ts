import * as dotenv from 'dotenv';
import './config/datadog-tracer';
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middlewares/filters/http-exception.filter';
import { ResponseInterceptor } from './middlewares/interceptors/response.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});

	const port = process.env.PORT || 3000;

	app.useLogger(app.get(Logger));

	app.enableCors({ origin: '*' });

	if (process.env.NODE_ENV !== 'production') {
		const swaggerConfig = new DocumentBuilder()
			.setTitle('operation-planning-bff')
			.setDescription('Bff for operation-planning-bff')
			.setVersion('1.0')
			.addBearerAuth()
			.addServer(`http://localhost:${port}`, 'local')
			.addServer(`https://operation-planning-bff.mottu.io`, 'hml')
			.build();
		const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup('/swagger', app, swaggerDocument);

		// Make the Swagger JSON available at /docs-json
		app.getHttpAdapter().get('swagger/swagger.json', (req, res) => {
			res.json(swaggerDocument);
		});
	}

	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new ResponseInterceptor(), new LoggerErrorInterceptor());

	await app.listen(port);
}
bootstrap();
