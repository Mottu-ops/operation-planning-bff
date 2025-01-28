import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { i18nTranslator } from '../../shared/utils/i18n-translator';
import { BaseResponse } from '../../shared/base-types/base-response.type';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse() as any;
		const i18nContext = I18nContext.current(host);

		const responseBody: BaseResponse = {
			result: null,
			error: true,
			errorMessages: this.handleExceptionMessage(exceptionResponse, i18nContext),
			stackTrace: undefined,
		};

		response.status(status).json(responseBody);
	}

	private handleExceptionMessage(message: any, i18nContext: I18nContext | undefined) {
		const translated = i18nTranslator(message, i18nContext);

		if (typeof translated === 'string') return translated;

		if (translated instanceof Array) return `${translated}`;

		if (translated?.message) return this.handleExceptionMessage(translated.message, i18nContext);

		if (translated?.errorMessages) return this.handleExceptionMessage(translated?.errorMessages, i18nContext);

		if (translated['mensagemErro']) return this.handleExceptionMessage(translated['mensagemErro'], i18nContext);

		return JSON.stringify(translated);
	}
}
