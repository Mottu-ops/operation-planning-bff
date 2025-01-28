import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		let errorMessage;
		if (exceptionResponse.hasOwnProperty('errorMessages')) {
			errorMessage = exceptionResponse['errorMessages'];
		} else if (exceptionResponse.hasOwnProperty('mensagemErro')) {
			errorMessage = exceptionResponse['mensagemErro'];
		} else if (exceptionResponse.hasOwnProperty('error')) {
			errorMessage = exceptionResponse['error'];
		} else {
			errorMessage = response.err?.message;
		}

		const customResponse = {
			result: null,
			error: true,
			errorMessages: errorMessage,
			path: request.url,
		};

		response.status(status ?? 503).json(customResponse);
	}
}
