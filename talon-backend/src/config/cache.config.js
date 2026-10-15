"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheConfig = void 0;
var config_1 = require("@nestjs/config");
exports.cacheConfig = (0, config_1.registerAs)('cache', function () { return ({
    dashboardTtlMs: 5 * 60 * 1000,
    analyticsTtlMs: 60 * 60 * 1000,
    notificationsTtlMs: 5 * 60 * 1000,
    streaksTtlMs: 5 * 60 * 1000,
}); });
