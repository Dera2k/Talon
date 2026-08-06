import { appConfig } from './app.config';
import { bullConfig } from './bull.config';
import { cacheConfig } from './cache.config';
import { databaseConfig } from './database.config';
import { jwtConfig } from './jwt.config';
import { redisConfig } from './redis.config';
import { throttleConfig } from './throttle.config';

export const configuration = [ appConfig, databaseConfig, jwtConfig, redisConfig, bullConfig, cacheConfig, throttleConfig ];