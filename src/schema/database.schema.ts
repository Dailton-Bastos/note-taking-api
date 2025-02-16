import Joi from "joi"

export const databaseSchema = {
	DATABASE_TYPE: Joi.string().required(),
	DATABASE_HOST: Joi.string().required(),
	DATABASE_PORT: Joi.number().default(5432),
	DATABASE_USERNAME: Joi.string().required(),
	DATABASE_DATABASE: Joi.string().required(),
	DATABASE_PASSWORD: Joi.string().required(),
	DATABASE_AUTOLOADENTITIES: Joi.number().min(0).max(1).default(0),
	DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
}
