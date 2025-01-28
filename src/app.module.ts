import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { makeCounterProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';
import { AppController } from './app.controller';
import { envSchema } from './config/env.schema';
import { HealthModule } from './health/health.module';
import { RequestCounterInterceptor } from './middlewares/interceptors/request-counter.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ExampleModule } from './modules/example/example.module';

const pinoPrettyConfig = {
	target: 'pino-pretty',
	options: {
		colorize: true,
		customColors: 'err:red,info:blue',
	},
};

const pathsExclude = ['req.headers.authorization'];

@Module({
	imports: [
		HealthModule,
		AuthModule,
		ConfigModule.forRoot({
			validationSchema: envSchema,
			ignoreEnvVars: process.env.NODE_ENV === 'local',
			validationOptions: {
				allowUnknown: process.env.NODE_ENV !== 'local',
				abortEarly: false,
			},
		}),
		PrometheusModule.register({
			defaultMetrics: {
				enabled: true,
			},
		}),
		I18nModule.forRoot({
			fallbackLanguage: 'pt-BR',
			fallbacks: {
				'pt-*': 'pt-BR',
				'es-*': 'es-MX',
			},
			loaderOptions: {
				path: path.join(__dirname, '/i18n/'),
				watch: true,
			},
			resolvers: [AcceptLanguageResolver],
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				name: 'operation-planning-bff',
				level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
				transport: process.env.NODE_ENV !== 'production' ? pinoPrettyConfig : undefined,
				customProps: () => ({
					context: 'HTTP',
				}),
				redact: { paths: pathsExclude },
			},
		}),
		ExampleModule,
	],
	controllers: [AppController],
	providers: [
		makeCounterProvider({
			name: 'routes',
			help: 'routes',
			labelNames: ['route'],
		}),
		{
			provide: APP_INTERCEPTOR,
			useClass: RequestCounterInterceptor,
		},
	],
})
export class AppModule {}
