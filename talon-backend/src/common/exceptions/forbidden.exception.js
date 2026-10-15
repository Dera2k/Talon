"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppForbiddenException = void 0;
var common_1 = require("@nestjs/common");
var error_code_enum_1 = require("@common/enums/error-code.enum");
var app_exception_1 = require("./app.exception");
var AppForbiddenException = /** @class */ (function (_super) {
    __extends(AppForbiddenException, _super);
    function AppForbiddenException(message) {
        if (message === void 0) { message = 'You do not have permission to perform this action'; }
        return _super.call(this, common_1.HttpStatus.FORBIDDEN, error_code_enum_1.ErrorCode.FORBIDDEN, message) || this;
    }
    return AppForbiddenException;
}(app_exception_1.AppException));
exports.AppForbiddenException = AppForbiddenException;
