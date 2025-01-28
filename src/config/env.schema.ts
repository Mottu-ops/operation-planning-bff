import * as Joi from 'joi';

const schemaValidations: { [key in keyof NodeJS.ProcessEnv]: any } = {
	NODE_ENV: Joi.string().valid('local', 'development', 'production'),
	PORT: Joi.number().default(3000),
	HTTP_DEBUG: Joi.boolean(),
};

export const envSchema = Joi.object(schemaValidations);
