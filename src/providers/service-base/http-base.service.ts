import { HttpException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HttpMethodEnum } from '../../shared/enumerations/http-method.enum';

@Injectable()
export class HttpBaseService {
	private omitPropertiesNamesFromLog = ['base64', 'stringBase64', 'imageBase64', 'imageBase64Url', 'selfieBase64'];

	constructor(
		@Inject(REQUEST) private req: Request,
		private readonly httpService: HttpService,
		@InjectPinoLogger(HttpBaseService.name) private readonly logger: PinoLogger
	) {}

	public async get<T>(url: string, throwException?: boolean): Promise<T> {
		return await this.request<T>(url, HttpMethodEnum.GET, null, throwException);
	}

	public async post<T>(url: string, data?: any | null, throwException?: boolean, timeout?: number): Promise<T> {
		return this.request<T>(url, HttpMethodEnum.POST, data, throwException, timeout);
	}

	public async delete<T>(url: string, data?: any | null): Promise<T> {
		return this.request<T>(url, HttpMethodEnum.DELETE, data);
	}

	public async put<T>(url: string, data?: any | null, throwException?: boolean): Promise<T> {
		return this.request<T>(url, HttpMethodEnum.PUT, data, throwException);
	}

	public async patch<T>(url: string, data?: any | null, throwException?: boolean): Promise<T> {
		return this.request<T>(url, HttpMethodEnum.PATCH, data, throwException);
	}

	//#region Private Methods
	private async request<T>(
		url: string,
		method: HttpMethodEnum,
		data?: any | null,
		throwException?: boolean,
		timeout?: number
	): Promise<T> {
		const config = await this.createConfig(url, method, data);
		if (timeout) config.timeout = timeout;
		return await new Promise<T>((resolve, reject) => {
			const sub = this.httpService.request<T>(config).subscribe({
				next: response => {
					this.logResponse('success', response, config);
					resolve(response.data);
					sub.unsubscribe();
				},
				error: err => {
					this.logResponse('error', err, config);
					if (throwException == null) {
						reject(new HttpException(err.response?.data ?? err.message, err.response?.status));
					} else {
						if (throwException == true) {
							reject(new HttpException(err.response?.data ?? err.message, err.response?.status));
						} else {
							resolve(err.response?.data);
						}
					}
				},
			});
		});
	}

	private excludeFromData(payload: any): any {
		if (payload === null) return payload;

		const data = { ...payload };
		this.excludeProperties(data);

		return data;
	}

	private excludeProperties(obj: any): void {
		if (obj && typeof obj === 'object') {
			Object.keys(obj).forEach(key => {
				if (this.omitPropertiesNamesFromLog.includes(key)) {
					obj[key] = 'Omitted ...';
				} else if (typeof obj[key] === 'object') {
					this.excludeProperties(obj[key]);
				}
			});
		}
	}

	private logResponse(logType: 'success' | 'error', response: any, config: any): void {
		config.headers.authorization = {};

		config.data = this.excludeFromData(config.data ?? null);
		const internalRequestBody = this.excludeFromData(this.req.body ?? null);

		const objectLog = {
			log_name: logType === 'success' ? 'external_call_success' : 'external_call_error',
			internalRequestInfo: {
				url: this.req.url,
				method: this.req.method,
				branchId: config.headers['branch-id'],
				data: internalRequestBody,
			},
			externalRequestInfo: config,
			response: logType === 'success' ? response?.data : response?.response?.data,
			statusCode: logType === 'success' ? response?.status : response?.response?.status,
		};

		if (logType === 'success') {
			this.logger.debug(objectLog);
		} else {
			this.logger.error(objectLog);
		}
	}

	private async createConfig(url: string, httpMethod: HttpMethodEnum, data?: any): Promise<Record<string, any>> {
		let configRequest: Record<string, any> = {};

		const authorization = this.req.headers.authorization;
		configRequest = {
			url: url,
			method: httpMethod,
			headers: {
				authorization: authorization,
				language: this.req.headers['language'] ? this.req.headers['language'].toString() : 'pt-BR',
				analystid: this.req.headers['analystid'] ? this.req.headers['analystid'].toString() : '',
				analystidv2: this.req.headers['analystidv2'] ? this.req.headers['analystidv2'].toString() : '',
				'user-agent': 'operation-planning-bff',
				'branch-id': this.req.headers['placeid'] ?? null,
			},
			data: data,
		};

		return configRequest;
	}
	//#endregion
}
