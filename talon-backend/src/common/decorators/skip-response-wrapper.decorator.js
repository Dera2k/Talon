"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipResponseWrapper = exports.SKIP_RESPONSE_WRAPPER_KEY = void 0;
var common_1 = require("@nestjs/common");
exports.SKIP_RESPONSE_WRAPPER_KEY = 'skipResponseWrapper';
var SkipResponseWrapper = function () {
    return (0, common_1.SetMetadata)(exports.SKIP_RESPONSE_WRAPPER_KEY, true);
};
exports.SkipResponseWrapper = SkipResponseWrapper;
