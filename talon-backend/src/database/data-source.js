"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var dotenv = require("dotenv");
var typeorm_1 = require("typeorm");
var typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
var environment = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development';
dotenv.config({ path: ".env.".concat(environment) });
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: (_b = process.env.DATABASE_HOST) !== null && _b !== void 0 ? _b : 'localhost',
    port: Number((_c = process.env.DATABASE_PORT) !== null && _c !== void 0 ? _c : 5432),
    username: (_d = process.env.DATABASE_USER) !== null && _d !== void 0 ? _d : 'talon',
    password: (_e = process.env.DATABASE_PASSWORD) !== null && _e !== void 0 ? _e : '',
    database: (_f = process.env.DATABASE_NAME) !== null && _f !== void 0 ? _f : 'talon',
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    synchronize: environment === 'development',
    logging: environment === 'development',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
