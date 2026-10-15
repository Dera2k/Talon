"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
var app_config_1 = require("./app.config");
var bull_config_1 = require("./bull.config");
var cache_config_1 = require("./cache.config");
var database_config_1 = require("./database.config");
var jwt_config_1 = require("./jwt.config");
var mail_config_1 = require("./mail.config");
var redis_config_1 = require("./redis.config");
var throttle_config_1 = require("./throttle.config");
exports.configuration = [
    app_config_1.appConfig,
    database_config_1.databaseConfig,
    jwt_config_1.jwtConfig,
    redis_config_1.redisConfig,
    bull_config_1.bullConfig,
    cache_config_1.cacheConfig,
    throttle_config_1.throttleConfig,
    mail_config_1.mailConfig,
];
