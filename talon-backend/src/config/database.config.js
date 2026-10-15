"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
var config_1 = require("@nestjs/config");
exports.databaseConfig = (0, config_1.registerAs)('database', function () {
    var _a, _b, _c, _d, _e;
    return ({
        host: (_a = process.env.DATABASE_HOST) !== null && _a !== void 0 ? _a : 'localhost',
        port: Number((_b = process.env.DATABASE_PORT) !== null && _b !== void 0 ? _b : 5432),
        name: (_c = process.env.DATABASE_NAME) !== null && _c !== void 0 ? _c : 'talon',
        username: (_d = process.env.DATABASE_USER) !== null && _d !== void 0 ? _d : 'talon',
        password: (_e = process.env.DATABASE_PASSWORD) !== null && _e !== void 0 ? _e : '',
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
    });
});
