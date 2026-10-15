"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var typeorm_1 = require("typeorm");
var typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
var user_seed_1 = require("./user.seed");
var habit_seed_1 = require("./habit.seed");
var notification_seed_1 = require("./notification.seed");
var environment = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development';
dotenv.config({ path: ".env.".concat(environment) });
dotenv.config();
var AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: (_b = process.env.DATABASE_HOST) !== null && _b !== void 0 ? _b : 'localhost',
    port: Number((_c = process.env.DATABASE_PORT) !== null && _c !== void 0 ? _c : 5432),
    username: (_d = process.env.DATABASE_USER) !== null && _d !== void 0 ? _d : 'talon',
    password: (_e = process.env.DATABASE_PASSWORD) !== null && _e !== void 0 ? _e : '',
    database: (_f = process.env.DATABASE_NAME) !== null && _f !== void 0 ? _f : 'talon',
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    synchronize: false,
    logging: environment === 'development',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.info('🌱 Starting database seed...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 9]);
                    return [4 /*yield*/, AppDataSource.initialize()];
                case 2:
                    _a.sent();
                    console.info('✓ Database connected');
                    return [4 /*yield*/, (0, user_seed_1.seedUsers)(AppDataSource)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, habit_seed_1.seedHabits)(AppDataSource)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, notification_seed_1.seedNotifications)(AppDataSource)];
                case 5:
                    _a.sent();
                    console.info('✅ Seed completed successfully');
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    console.error('❌ Seed failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, AppDataSource.destroy()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
void bootstrap();
