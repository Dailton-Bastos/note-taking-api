import Joi from "joi"

export const jwtSchema = {
	JWT_SECRET: Joi.string().required(),
	JWT_TOKEN_AUDIENCE: Joi.string().required(),
	JWT_TOKEN_ISSUER: Joi.string().required(),
	JWT_TTL: Joi.number().default(3600),
}
