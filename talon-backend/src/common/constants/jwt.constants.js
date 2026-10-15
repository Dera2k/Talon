"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONSTANTS = exports.REFRESH_REUSE_GRACE_MS = exports.PASSWORD_RESET_TTL_MS = exports.MOBILE_CLIENT_VALUE = exports.MOBILE_CLIENT_HEADER = exports.REFRESH_COOKIE_PATH = exports.REFRESH_COOKIE_NAME = void 0;
exports.REFRESH_COOKIE_NAME = 'refresh_token';
exports.REFRESH_COOKIE_PATH = '/';
exports.MOBILE_CLIENT_HEADER = 'x-client-type';
exports.MOBILE_CLIENT_VALUE = 'mobile';
exports.PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
exports.REFRESH_REUSE_GRACE_MS = 10000;
exports.JWT_CONSTANTS = {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '30d',
    REFRESH_TOKEN_BYTES: 32,
    RESET_TOKEN_EXPIRY_MS: 60 * 60 * 1000,
};
