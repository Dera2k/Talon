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
exports.IsTimezone = IsTimezone;
var class_validator_1 = require("class-validator");
var timezone_util_1 = require("@common/utils/timezone.util");
function IsTimezone(options) {
    return function (target, propertyKey) {
        (0, class_validator_1.registerDecorator)({
            name: 'isTimezone',
            target: target.constructor,
            propertyName: String(propertyKey),
            options: __assign({ message: "".concat(String(propertyKey), " must be a valid IANA timezone") }, options),
            validator: {
                validate: function (value) {
                    return typeof value === 'string' && (0, timezone_util_1.isValidTimezone)(value);
                },
            },
        });
    };
}
