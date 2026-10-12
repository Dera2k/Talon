import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? false,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
