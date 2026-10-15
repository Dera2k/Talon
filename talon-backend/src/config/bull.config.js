"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullConfig = void 0;
var config_1 = require("@nestjs/config");
exports.bullConfig = (0, config_1.registerAs)('bull', function () { return ({
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: 1000,
        removeOnFail: 5000,
    },
}); });
