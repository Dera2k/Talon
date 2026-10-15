"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttleConfig = void 0;
var config_1 = require("@nestjs/config");
exports.throttleConfig = (0, config_1.registerAs)('throttle', function () { return ({
    ttl: 15 * 60 * 1000,
    limit: 100,
}); });
