import Joi from "joi"

export const jwtSchema = {
	JWT_SECRET: Joi.string().required(),
	JWT_TOKEN_AUDIENCE: Joi.string().required(),
	JWT_TOKEN_ISSUER: Joi.string().required(),
	JWT_TTL: Joi.number().default(3600),
	JWT_REFRESH_TTL: Joi.number().default(86400), // 24h,
}
