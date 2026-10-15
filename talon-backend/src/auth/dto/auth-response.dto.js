"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
var user_response_dto_1 = require("@users/dto/user-response.dto");
var AuthResponseDto = /** @class */ (function () {
    function AuthResponseDto() {
    }
    AuthResponseDto.from = function (session, includeRefreshToken) {
        return __assign(__assign({ accessToken: session.accessToken }, (includeRefreshToken && { refreshToken: session.refreshToken })), { user: user_response_dto_1.UserResponseDto.from(session.user) });
    };
    return AuthResponseDto;
}());
exports.AuthResponseDto = AuthResponseDto;
