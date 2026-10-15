"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var throttler_1 = require("@nestjs/throttler");
var jwt_constants_1 = require("@common/constants/jwt.constants");
var public_decorator_1 = require("@common/decorators/public.decorator");
var error_code_enum_1 = require("@common/enums/error-code.enum");
var app_exception_1 = require("@common/exceptions/app.exception");
var auth_response_dto_1 = require("./dto/auth-response.dto");
var AUTH_THROTTLE = { default: { limit: 5, ttl: 60000 } };
var IS_PRODUCTION = process.env.NODE_ENV === 'production';
var isMobileClient = function (req) {
    return req.header(jwt_constants_1.MOBILE_CLIENT_HEADER) === jwt_constants_1.MOBILE_CLIENT_VALUE;
};
var AuthController = function () {
    var _classDecorators = [(0, common_1.Controller)('auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _register_decorators;
    var _login_decorators;
    var _refresh_decorators;
    var _logout_decorators;
    var _logoutAll_decorators;
    var _forgotPassword_decorators;
    var _resetPassword_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
        }
        AuthController_1.prototype.register = function (dto, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.toResponse;
                            return [4 /*yield*/, this.authService.register(dto)];
                        case 1: return [2 /*return*/, _a.apply(this, [_b.sent(), req, res])];
                    }
                });
            });
        };
        AuthController_1.prototype.login = function (dto, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.toResponse;
                            return [4 /*yield*/, this.authService.login(dto)];
                        case 1: return [2 /*return*/, _a.apply(this, [_b.sent(), req, res])];
                    }
                });
            });
        };
        AuthController_1.prototype.refresh = function (dto, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var token, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            token = this.extractRefreshToken(req, dto);
                            if (!token) {
                                throw new app_exception_1.AppException(common_1.HttpStatus.UNAUTHORIZED, error_code_enum_1.ErrorCode.UNAUTHORIZED, 'Refresh token missing');
                            }
                            _a = this.toResponse;
                            return [4 /*yield*/, this.authService.refresh(token)];
                        case 1: return [2 /*return*/, _a.apply(this, [_b.sent(), req, res])];
                    }
                });
            });
        };
        AuthController_1.prototype.logout = function (dto, req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = this.extractRefreshToken(req, dto);
                            if (!token) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.authService.logout(token)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            res.clearCookie(jwt_constants_1.REFRESH_COOKIE_NAME, { path: jwt_constants_1.REFRESH_COOKIE_PATH });
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.logoutAll = function (user, res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.logoutAll(user.id)];
                        case 1:
                            _a.sent();
                            res.clearCookie(jwt_constants_1.REFRESH_COOKIE_NAME, { path: jwt_constants_1.REFRESH_COOKIE_PATH });
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.forgotPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.forgotPassword(dto.email)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.resetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.resetPassword(dto)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.extractRefreshToken = function (req, dto) {
            var _a;
            return isMobileClient(req)
                ? dto.refreshToken
                : (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[jwt_constants_1.REFRESH_COOKIE_NAME];
        };
        AuthController_1.prototype.toResponse = function (session, req, res) {
            var isMobile = isMobileClient(req);
            if (!isMobile) {
                res.cookie(jwt_constants_1.REFRESH_COOKIE_NAME, session.refreshToken, {
                    httpOnly: true,
                    secure: IS_PRODUCTION,
                    sameSite: 'lax',
                    path: jwt_constants_1.REFRESH_COOKIE_PATH,
                    expires: session.refreshExpiresAt,
                });
            }
            return auth_response_dto_1.AuthResponseDto.from(session, isMobile);
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _register_decorators = [(0, public_decorator_1.Public)(), (0, throttler_1.Throttle)(AUTH_THROTTLE), (0, common_1.Post)('register')];
        _login_decorators = [(0, public_decorator_1.Public)(), (0, throttler_1.Throttle)(AUTH_THROTTLE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Post)('login')];
        _refresh_decorators = [(0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Post)('refresh')];
        _logout_decorators = [(0, public_decorator_1.Public)(), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, common_1.Post)('logout')];
        _logoutAll_decorators = [(0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, common_1.Post)('logout-all')];
        _forgotPassword_decorators = [(0, public_decorator_1.Public)(), (0, throttler_1.Throttle)(AUTH_THROTTLE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Post)('forgot-password')];
        _resetPassword_decorators = [(0, public_decorator_1.Public)(), (0, throttler_1.Throttle)(AUTH_THROTTLE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Post)('reset-password')];
        __esDecorate(_classThis, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: function (obj) { return "register" in obj; }, get: function (obj) { return obj.register; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refresh_decorators, { kind: "method", name: "refresh", static: false, private: false, access: { has: function (obj) { return "refresh" in obj; }, get: function (obj) { return obj.refresh; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: function (obj) { return "logout" in obj; }, get: function (obj) { return obj.logout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logoutAll_decorators, { kind: "method", name: "logoutAll", static: false, private: false, access: { has: function (obj) { return "logoutAll" in obj; }, get: function (obj) { return obj.logoutAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forgotPassword_decorators, { kind: "method", name: "forgotPassword", static: false, private: false, access: { has: function (obj) { return "forgotPassword" in obj; }, get: function (obj) { return obj.forgotPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: function (obj) { return "resetPassword" in obj; }, get: function (obj) { return obj.resetPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
