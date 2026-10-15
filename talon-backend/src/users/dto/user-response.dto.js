"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = void 0;
var UserResponseDto = /** @class */ (function () {
    function UserResponseDto() {
    }
    UserResponseDto.from = function (user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            timezone: user.timezone,
            theme: user.theme,
            createdAt: user.createdAt,
        };
    };
    return UserResponseDto;
}());
exports.UserResponseDto = UserResponseDto;
