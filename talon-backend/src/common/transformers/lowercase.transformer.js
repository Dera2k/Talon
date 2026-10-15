"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lowercase = void 0;
var class_transformer_1 = require("class-transformer");
var Lowercase = function () {
    return (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        return typeof value === 'string' ? value.toLowerCase() : value;
    });
};
exports.Lowercase = Lowercase;
