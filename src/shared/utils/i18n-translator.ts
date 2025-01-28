import { I18nContext } from 'nestjs-i18n';

export function i18nTranslator(value: any, ctx: I18nContext | undefined): any {
	if (ctx) {
		if (typeof value === 'string') {
			return value.includes('i18n') ? ctx.t(value) : value;
		}

		if (value instanceof Date) {
			return value;
		}

		if (typeof value === 'object' && value !== null) {
			if (value instanceof Array) {
				return value.map(insideValue => i18nTranslator(insideValue, ctx));
			}

			if (value?.i18nTemplate) {
				return ctx.t(value.i18nTemplate, {
					args: i18nTranslator(value.args, ctx),
				});
			}

			return Object.keys(value).reduce((acc, key) => {
				acc[key] = i18nTranslator(value[key], ctx);

				return acc;
			}, {} as any);
		}
	}

	return value;
}
