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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var argon2 = require("argon2");
var node_crypto_1 = require("node:crypto");
var typeorm_1 = require("typeorm");
var jwt_constants_1 = require("@common/constants/jwt.constants");
var error_code_enum_1 = require("@common/enums/error-code.enum");
var token_type_enum_1 = require("@common/enums/token-type.enum");
var app_exception_1 = require("@common/exceptions/app.exception");
var crypto_util_1 = require("@common/utils/crypto.util");
var duration_util_1 = require("@common/utils/duration.util");
var user_entity_1 = require("@users/entities/user.entity");
var password_reset_token_entity_1 = require("./entities/password-reset-token.entity");
var refresh_token_entity_1 = require("./entities/refresh-token.entity");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(users, mail, jwt, dataSource, config, refreshTokens, resetTokens) {
            this.users = users;
            this.mail = mail;
            this.jwt = jwt;
            this.dataSource = dataSource;
            this.refreshTokens = refreshTokens;
            this.resetTokens = resetTokens;
            this.dummyHash = argon2.hash((0, node_crypto_1.randomUUID)());
            this.refreshTtlMs = (0, duration_util_1.durationToMs)(config.getOrThrow('jwt.refreshExpiresIn'));
            this.resetPasswordUrl = config.getOrThrow('mail.resetPasswordUrl');
        }
        AuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = (_a = this.users).create;
                            _c = {
                                email: dto.email
                            };
                            return [4 /*yield*/, argon2.hash(dto.password)];
                        case 1: return [4 /*yield*/, _b.apply(_a, [(_c.passwordHash = _d.sent(),
                                    _c.firstName = dto.firstName,
                                    _c.lastName = dto.lastName,
                                    _c.timezone = dto.timezone,
                                    _c)])];
                        case 2:
                            user = _d.sent();
                            return [2 /*return*/, this.issueSession(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.login = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isValid, _a, _b, _c;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.users.findByEmailWithPassword(dto.email)];
                        case 1:
                            user = _e.sent();
                            _b = (_a = argon2).verify;
                            if (!((_d = user === null || user === void 0 ? void 0 : user.passwordHash) !== null && _d !== void 0)) return [3 /*break*/, 2];
                            _c = _d;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.dummyHash];
                        case 3:
                            _c = (_e.sent());
                            _e.label = 4;
                        case 4: return [4 /*yield*/, _b.apply(_a, [_c, dto.password])];
                        case 5:
                            isValid = _e.sent();
                            if (!user || !isValid) {
                                throw this.unauthorized('Invalid credentials');
                            }
                            return [2 /*return*/, this.issueSession(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.refresh = function (rawToken) {
            return __awaiter(this, void 0, void 0, function () {
                var stored, isRecentRotation, claimed, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refreshTokens.findOneBy({
                                tokenHash: (0, crypto_util_1.hashToken)(rawToken),
                            })];
                        case 1:
                            stored = _a.sent();
                            if (!stored)
                                throw this.unauthorized('Invalid refresh token');
                            if (!stored.revokedAt) return [3 /*break*/, 4];
                            isRecentRotation = Date.now() - stored.revokedAt.getTime() < jwt_constants_1.REFRESH_REUSE_GRACE_MS;
                            if (!!isRecentRotation) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.revokeFamily(stored.familyId)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: throw this.unauthorized('Invalid refresh token');
                        case 4:
                            if (stored.expiresAt <= new Date()) {
                                throw this.unauthorized('Invalid refresh token');
                            }
                            return [4 /*yield*/, this.refreshTokens.update({ id: stored.id, revokedAt: (0, typeorm_1.IsNull)() }, { revokedAt: new Date() })];
                        case 5:
                            claimed = _a.sent();
                            if (!claimed.affected)
                                throw this.unauthorized('Invalid refresh token');
                            return [4 /*yield*/, this.users.findById(stored.userId)];
                        case 6:
                            user = _a.sent();
                            if (!user)
                                throw this.unauthorized('Invalid refresh token');
                            return [2 /*return*/, this.issueSession(user, stored.familyId)];
                    }
                });
            });
        };
        AuthService_1.prototype.logout = function (rawToken) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refreshTokens.update({ tokenHash: (0, crypto_util_1.hashToken)(rawToken), revokedAt: (0, typeorm_1.IsNull)() }, { revokedAt: new Date() })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.logoutAll = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.refreshTokens.update({ userId: userId, revokedAt: (0, typeorm_1.IsNull)() }, { revokedAt: new Date() })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.forgotPassword = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.users.findByEmail(email)];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/];
                            token = (0, crypto_util_1.generateToken)();
                            return [4 /*yield*/, this.resetTokens.save(this.resetTokens.create({
                                    userId: user.id,
                                    tokenHash: (0, crypto_util_1.hashToken)(token),
                                    expiresAt: new Date(Date.now() + jwt_constants_1.PASSWORD_RESET_TTL_MS),
                                    usedAt: null,
                                }))];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.mail.sendPasswordReset(user.email, "".concat(this.resetPasswordUrl, "?token=").concat(token))];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.resetPassword = function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var tokenHash, passwordHash;
                var _this = this;
                var token = _b.token, newPassword = _b.newPassword;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tokenHash = (0, crypto_util_1.hashToken)(token);
                            return [4 /*yield*/, argon2.hash(newPassword)];
                        case 1:
                            passwordHash = _c.sent();
                            return [4 /*yield*/, this.dataSource.transaction(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                                    var claimed, record;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, manager.update(password_reset_token_entity_1.PasswordResetToken, { tokenHash: tokenHash, usedAt: (0, typeorm_1.IsNull)(), expiresAt: (0, typeorm_1.MoreThan)(new Date()) }, { usedAt: new Date() })];
                                            case 1:
                                                claimed = _a.sent();
                                                if (!claimed.affected) {
                                                    throw new app_exception_1.AppException(common_1.HttpStatus.BAD_REQUEST, error_code_enum_1.ErrorCode.BUSINESS_LOGIC_ERROR, 'Reset token is invalid or expired');
                                                }
                                                return [4 /*yield*/, manager.findOneByOrFail(password_reset_token_entity_1.PasswordResetToken, {
                                                        tokenHash: tokenHash,
                                                    })];
                                            case 2:
                                                record = _a.sent();
                                                return [4 /*yield*/, manager.update(user_entity_1.User, record.userId, { passwordHash: passwordHash })];
                                            case 3:
                                                _a.sent();
                                                return [4 /*yield*/, manager.update(refresh_token_entity_1.RefreshToken, { userId: record.userId, revokedAt: (0, typeorm_1.IsNull)() }, { revokedAt: new Date() })];
                                            case 4:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.issueSession = function (user_1) {
            return __awaiter(this, arguments, void 0, function (user, familyId) {
                var payload, refreshToken, refreshExpiresAt;
                if (familyId === void 0) { familyId = (0, node_crypto_1.randomUUID)(); }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = { sub: user.id, type: token_type_enum_1.TokenType.ACCESS };
                            refreshToken = (0, crypto_util_1.generateToken)();
                            refreshExpiresAt = new Date(Date.now() + this.refreshTtlMs);
                            return [4 /*yield*/, this.refreshTokens.save(this.refreshTokens.create({
                                    userId: user.id,
                                    familyId: familyId,
                                    tokenHash: (0, crypto_util_1.hashToken)(refreshToken),
                                    expiresAt: refreshExpiresAt,
                                    revokedAt: null,
                                }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    accessToken: this.jwt.sign(payload),
                                    refreshToken: refreshToken,
                                    refreshExpiresAt: refreshExpiresAt,
                                    user: user,
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.revokeFamily = function (familyId) {
            return this.refreshTokens.update({ familyId: familyId, revokedAt: (0, typeorm_1.IsNull)() }, { revokedAt: new Date() });
        };
        AuthService_1.prototype.unauthorized = function (message) {
            return new app_exception_1.AppException(common_1.HttpStatus.UNAUTHORIZED, error_code_enum_1.ErrorCode.UNAUTHORIZED, message);
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
