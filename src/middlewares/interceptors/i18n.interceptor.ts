import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { map, Observable } from 'rxjs';
import { i18nTranslator } from '../../shared/utils/i18n-translator';

export class I18nInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const i18nContext = I18nContext.current();

		return next.handle().pipe(
			map(data => {
				return i18nTranslator(data, i18nContext);
			})
		);
	}
}
