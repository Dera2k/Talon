"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
var config_1 = require("@nestjs/config");
exports.jwtConfig = (0, config_1.registerAs)('jwt', function () {
    var _a, _b;
    return ({
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: (_a = process.env.JWT_ACCESS_EXPIRES_IN) !== null && _a !== void 0 ? _a : '20m',
        refreshExpiresIn: (_b = process.env.JWT_REFRESH_EXPIRES_IN) !== null && _b !== void 0 ? _b : '7d',
    });
});
