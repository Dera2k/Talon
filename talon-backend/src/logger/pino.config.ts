import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export function createPinoOptions(config: ConfigService): Params {
  const isDevelopment = config.getOrThrow<string>('app.env') === 'development';

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
      genReqId: (request, response) => {
        const headerId = request.headers['x-request-id'];
        const requestId =
          typeof headerId === 'string' && headerId.length > 0
            ? headerId
            : randomUUID();

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
