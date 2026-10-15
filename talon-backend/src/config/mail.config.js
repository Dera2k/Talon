"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailConfig = void 0;
var config_1 = require("@nestjs/config");
exports.mailConfig = (0, config_1.registerAs)('mail', function () {
    var _a, _b;
    return ({
        resendApiKey: process.env.RESEND_API_KEY,
        from: (_a = process.env.MAIL_FROM) !== null && _a !== void 0 ? _a : 'Talon <onboarding@resend.dev>',
        resetPasswordUrl: (_b = process.env.PASSWORD_RESET_URL) !== null && _b !== void 0 ? _b : 'http://localhost:3000/reset-password',
    });
});
