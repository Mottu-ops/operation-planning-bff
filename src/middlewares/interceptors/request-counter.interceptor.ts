import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { Observable } from 'rxjs';

export class RequestCounterInterceptor implements NestInterceptor {
	constructor(@InjectMetric('routes') private counter: Counter<string>) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		const url = context.switchToHttp().getRequest().url as string;

		this.counter.inc({ route: url });

		return next.handle();
	}
}
