"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
var Joi = require("joi");
exports.validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'test', 'production')
        .default('development'),
    PORT: Joi.number().port().default(3000),
    API_PREFIX: Joi.string().default('api'),
    CORS_ORIGINS: Joi.string().required(),
    DATABASE_HOST: Joi.string().hostname().required(),
    DATABASE_PORT: Joi.number().port().default(5432),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().allow('').required(),
    REDIS_HOST: Joi.string().hostname().required(),
    REDIS_PORT: Joi.number().port().default(6379),
    REDIS_PASSWORD: Joi.string().allow('').optional(),
    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
    RESEND_API_KEY: Joi.string().when('NODE_ENV', {
        is: 'production',
        then: Joi.required(),
    }),
    MAIL_FROM: Joi.string().default('Talon <onboarding@resend.dev>'),
    PASSWORD_RESET_URL: Joi.string()
        .uri()
        .default('http://localhost:3000/reset-password'),
});
