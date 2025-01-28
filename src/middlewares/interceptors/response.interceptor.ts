import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BaseResponse } from '../../shared/base-types/base-response.type';

export class ResponseInterceptor implements NestInterceptor {
	private logger = new Logger(ResponseInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const url = context.switchToHttp().getRequest().url as string;

		if (url.startsWith('/health') || url.startsWith('/metrics')) {
			return next.handle();
		}

		return next.handle().pipe(
			map(data => {
				const responseBody: BaseResponse = {
					result: data ?? null,
					error: false,
					errorMessages: undefined,
				};

				if (process.env.NODE_ENV !== 'production') {
					this.logger.log({ url, responseBody });
				}

				return responseBody;
			})
		);
	}
}
