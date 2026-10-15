"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var core_1 = require("@nestjs/core");
var cache_manager_1 = require("@nestjs/cache-manager");
var config_1 = require("@nestjs/config");
var bullmq_1 = require("@nestjs/bullmq");
var throttler_1 = require("@nestjs/throttler");
var common_2 = require("@nestjs/common");
var configuration_1 = require("./config/configuration");
var validation_config_1 = require("./config/validation.config");
var database_module_1 = require("./database/database.module");
var logger_module_1 = require("./logger/logger.module");
var health_module_1 = require("./health/health.module");
var users_module_1 = require("@users/users.module");
var auth_module_1 = require("@auth/auth.module");
var mail_module_1 = require("@mail/mail.module");
var habits_module_1 = require("@habits/habits.module");
var settings_module_1 = require("@settings/settings.module");
var all_exceptions_filter_1 = require("@common/filters/all-exceptions.filter");
var response_interceptor_1 = require("@common/interceptors/response.interceptor");
var jwt_auth_guard_1 = require("@common/guards/jwt-auth.guard");
var AppModule = function () {
    var _a;
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    load: configuration_1.configuration,
                    validationSchema: validation_config_1.validationSchema,
                    envFilePath: [".env.".concat((_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'development'), '.env'],
                }),
                database_module_1.DatabaseModule,
                logger_module_1.LoggerModule,
                bullmq_1.BullModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (config) { return ({
                        connection: {
                            host: config.getOrThrow('redis.host'),
                            port: config.getOrThrow('redis.port'),
                            password: config.get('redis.password'),
                        },
                        defaultJobOptions: config.getOrThrow('bull.defaultJobOptions'),
                    }); },
                }),
                cache_manager_1.CacheModule.register({
                    isGlobal: true,
                }),
                throttler_1.ThrottlerModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (config) {
                        var throttle = config.getOrThrow('throttle');
                        return [{ ttl: throttle.ttl, limit: throttle.limit }];
                    },
                }),
                health_module_1.HealthModule,
                users_module_1.UsersModule,
                auth_module_1.AuthModule,
                mail_module_1.MailModule,
                settings_module_1.SettingsModule,
                habits_module_1.HabitsModule,
            ],
            providers: [
                { provide: core_1.APP_FILTER, useClass: all_exceptions_filter_1.AllExceptionsFilter },
                { provide: core_1.APP_INTERCEPTOR, useClass: response_interceptor_1.ResponseInterceptor },
                { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
                { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
                {
                    provide: core_1.APP_PIPE,
                    useValue: new common_2.ValidationPipe({
                        whitelist: true,
                        forbidNonWhitelisted: true,
                        transform: true,
                    }),
                },
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
