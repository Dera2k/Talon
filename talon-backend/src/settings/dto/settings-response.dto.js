"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsResponseDto = void 0;
var SettingsResponseDto = /** @class */ (function () {
    function SettingsResponseDto() {
    }
    SettingsResponseDto.from = function (user) {
        return { timezone: user.timezone, theme: user.theme };
    };
    return SettingsResponseDto;
}());
exports.SettingsResponseDto = SettingsResponseDto;
