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
exports.TokenService = void 0;
var common_1 = require("@nestjs/common");
var crypto = require("crypto");
var jwt_constants_1 = require("@common/constants/jwt.constants");
var TokenService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TokenService = _classThis = /** @class */ (function () {
        function TokenService_1() {
        }
        TokenService_1.prototype.generateRefreshToken = function () {
            return crypto
                .randomBytes(jwt_constants_1.JWT_CONSTANTS.REFRESH_TOKEN_BYTES)
                .toString('hex');
        };
        TokenService_1.prototype.hashToken = function (token) {
            return crypto.createHash('sha256').update(token).digest('hex');
        };
        TokenService_1.prototype.generateResetToken = function () {
            return crypto.randomBytes(32).toString('hex');
        };
        TokenService_1.prototype.getRefreshTokenExpiry = function () {
            var ms = this.parseExpiry(jwt_constants_1.JWT_CONSTANTS.REFRESH_TOKEN_EXPIRY);
            return new Date(Date.now() + ms);
        };
        TokenService_1.prototype.getResetTokenExpiry = function () {
            return new Date(Date.now() + jwt_constants_1.JWT_CONSTANTS.RESET_TOKEN_EXPIRY_MS);
        };
        TokenService_1.prototype.parseExpiry = function (expiry) {
            var match = expiry.match(/^(\d+)([smhd])$/);
            if (!match)
                return 30 * 24 * 60 * 60 * 1000;
            var value = parseInt(match[1], 10);
            var unit = match[2];
            switch (unit) {
                case 's':
                    return value * 1000;
                case 'm':
                    return value * 60 * 1000;
                case 'h':
                    return value * 60 * 60 * 1000;
                case 'd':
                    return value * 24 * 60 * 60 * 1000;
                default:
                    return 30 * 24 * 60 * 60 * 1000;
            }
        };
        return TokenService_1;
    }());
    __setFunctionName(_classThis, "TokenService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TokenService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TokenService = _classThis;
}();
exports.TokenService = TokenService;
