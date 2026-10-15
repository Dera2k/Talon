"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPasswordStrong = void 0;
var common_1 = require("@nestjs/common");
var class_validator_1 = require("class-validator");
var IsPasswordStrong = function () {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)(), (0, class_validator_1.IsStrongPassword)(), (0, class_validator_1.MaxLength)(128));
};
exports.IsPasswordStrong = IsPasswordStrong;
