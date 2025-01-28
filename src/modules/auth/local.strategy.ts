import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { decode } from 'jsonwebtoken';
import { Strategy } from 'passport-custom';
import { TokenPayload } from './dto/token-payload.dto';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'custom') {
	constructor() {
		super();
	}

	async validate(req) {
		const token = req.headers.authorization?.replace('Bearer ', '') || req.query.authorization?.replace('Bearer ', '');

		const i18nCtx = I18nContext.current();

		if (!token) {
			throw new UnauthorizedException(i18nCtx?.t('errors.i18n.NO_TOKEN_PROVIDED'));
		}

		const decoded = decode(token) as TokenPayload;

		if (!decoded) {
			throw new UnauthorizedException();
		}

		const config = {
			headers: {
				USERAGENT_HEADER: req.headers['useragent_header'] ?? '',
				USERAGENT_VALUE: req.headers['useragent_value'] ?? '',
				DEVICENAME_HEADER: req.headers['devicename_header'] ?? '',
				BRANCHID_HEADER: req.headers['branchid_header'] ?? '',
				BRANCHCODE_HEADER: req.headers['branchcode_header'] ?? '',
				language: i18nCtx?.lang ?? '',
				'accept-language': i18nCtx?.lang ?? '',
				authorization: `Bearer ${token}`,
			},
		};

		return {
			...decoded,
			config,
		};
	}
}
