import { AxiosRequestConfig } from 'axios';

export type TokenPayload = {
	id: string;
	config: AxiosRequestConfig;
};
