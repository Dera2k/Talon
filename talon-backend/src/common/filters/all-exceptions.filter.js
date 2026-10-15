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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
var common_1 = require("@nestjs/common");
var error_code_enum_1 = require("@common/enums/error-code.enum");
var app_exception_1 = require("@common/exceptions/app.exception");
var STATUS_TO_ERROR_CODE = (_a = {},
    _a[common_1.HttpStatus.BAD_REQUEST] = error_code_enum_1.ErrorCode.VALIDATION_ERROR,
    _a[common_1.HttpStatus.UNAUTHORIZED] = error_code_enum_1.ErrorCode.UNAUTHORIZED,
    _a[common_1.HttpStatus.FORBIDDEN] = error_code_enum_1.ErrorCode.FORBIDDEN,
    _a[common_1.HttpStatus.NOT_FOUND] = error_code_enum_1.ErrorCode.NOT_FOUND,
    _a[common_1.HttpStatus.CONFLICT] = error_code_enum_1.ErrorCode.CONFLICT,
    _a[common_1.HttpStatus.TOO_MANY_REQUESTS] = error_code_enum_1.ErrorCode.RATE_LIMITED,
    _a[common_1.HttpStatus.SERVICE_UNAVAILABLE] = error_code_enum_1.ErrorCode.SERVICE_UNAVAILABLE,
    _a);
var INTERNAL_SERVER_ERROR_STATUS = Number(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
var AllExceptionsFilter = function () {
    var _classDecorators = [(0, common_1.Catch)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AllExceptionsFilter = _classThis = /** @class */ (function () {
        function AllExceptionsFilter_1() {
            this.logger = new common_1.Logger(AllExceptionsFilter.name);
        }
        AllExceptionsFilter_1.prototype.catch = function (exception, host) {
            var http = host.switchToHttp();
            var request = http.getRequest();
            var response = http.getResponse();
            var _a = this.resolve(exception), status = _a.status, error = _a.error;
            if (status >= INTERNAL_SERVER_ERROR_STATUS) {
                this.logger.error("".concat(request.method, " ").concat(request.url), exception instanceof Error ? exception.stack : String(exception));
            }
            response.status(status).json({
                success: false,
                error: error,
                path: request.url,
                timestamp: new Date().toISOString(),
            });
        };
        AllExceptionsFilter_1.prototype.resolve = function (exception) {
            if (exception instanceof app_exception_1.AppException) {
                return {
                    status: exception.getStatus(),
                    error: { code: exception.code, message: exception.message },
                };
            }
            if (exception instanceof common_1.HttpException) {
                return this.fromHttpException(exception);
            }
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: {
                    code: error_code_enum_1.ErrorCode.INTERNAL_SERVER_ERROR,
                    message: 'Internal server error',
                },
            };
        };
        AllExceptionsFilter_1.prototype.fromHttpException = function (exception) {
            var _a;
            var status = exception.getStatus();
            var body = exception.getResponse();
            var message = typeof body === 'object' && 'message' in body
                ? body.message
                : exception.message;
            if (Array.isArray(message)) {
                return {
                    status: status,
                    error: {
                        code: error_code_enum_1.ErrorCode.VALIDATION_ERROR,
                        message: 'Validation failed',
                        details: message,
                    },
                };
            }
            var fallback = status >= INTERNAL_SERVER_ERROR_STATUS
                ? error_code_enum_1.ErrorCode.INTERNAL_SERVER_ERROR
                : error_code_enum_1.ErrorCode.BUSINESS_LOGIC_ERROR;
            return {
                status: status,
                error: { code: (_a = STATUS_TO_ERROR_CODE[status]) !== null && _a !== void 0 ? _a : fallback, message: message },
            };
        };
        return AllExceptionsFilter_1;
    }());
    __setFunctionName(_classThis, "AllExceptionsFilter");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AllExceptionsFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AllExceptionsFilter = _classThis;
}();
exports.AllExceptionsFilter = AllExceptionsFilter;
