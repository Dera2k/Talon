"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
var config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', function () {
    var _a, _b, _c, _d;
    return ({
        env: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development',
        port: Number((_b = process.env.PORT) !== null && _b !== void 0 ? _b : 3000),
        apiPrefix: (_c = process.env.API_PREFIX) !== null && _c !== void 0 ? _c : 'api',
        corsOrigin: (_d = process.env.CORS_ORIGIN) !== null && _d !== void 0 ? _d : 'http://localhost:3001',
    });
});
