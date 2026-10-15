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
exports.AppException = void 0;
var common_1 = require("@nestjs/common");
var AppException = /** @class */ (function (_super) {
    __extends(AppException, _super);
    function AppException(status, code, message) {
        var _this = _super.call(this, { statusCode: status, code: code, message: message }, status) || this;
        _this.code = code;
        return _this;
    }
    return AppException;
}(common_1.HttpException));
exports.AppException = AppException;
