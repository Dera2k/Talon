"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
var config_1 = require("@nestjs/config");
exports.redisConfig = (0, config_1.registerAs)('redis', function () {
    var _a, _b;
    return ({
        host: (_a = process.env.REDIS_HOST) !== null && _a !== void 0 ? _a : 'localhost',
        port: Number((_b = process.env.REDIS_PORT) !== null && _b !== void 0 ? _b : 6379),
        password: process.env.REDIS_PASSWORD || undefined,
    });
});
