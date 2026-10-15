"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPinoOptions = createPinoOptions;
var node_crypto_1 = require("node:crypto");
function createPinoOptions(config) {
    var isDevelopment = config.getOrThrow('app.env') === 'development';
    return {
        pinoHttp: {
            level: isDevelopment ? 'debug' : 'info',
            transport: isDevelopment
                ? {
                    target: 'pino-pretty',
                    options: {
                        singleLine: true,
                        colorize: true,
                        translateTime: 'SYS:standard',
                    },
                }
                : undefined,
            genReqId: function (request, response) {
                var headerId = request.headers['x-request-id'];
                var requestId = typeof headerId === 'string' && headerId.length > 0
                    ? headerId
                    : (0, node_crypto_1.randomUUID)();
                response.setHeader('x-request-id', requestId);
                return requestId;
            },
            redact: {
                paths: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'res.headers.set-cookie',
                    'password',
                    'refreshToken',
                ],
                censor: '[REDACTED]',
            },
        },
    };
}
