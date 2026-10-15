"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trim = void 0;
var class_transformer_1 = require("class-transformer");
var Trim = function () {
    return (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        return typeof value === 'string' ? value.trim() : value;
    });
};
exports.Trim = Trim;
