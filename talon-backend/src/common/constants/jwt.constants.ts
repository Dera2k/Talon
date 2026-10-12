export const REFRESH_COOKIE_NAME = 'refresh_token';
export const REFRESH_COOKIE_PATH = '/';
export const MOBILE_CLIENT_HEADER = 'x-client-type';
export const MOBILE_CLIENT_VALUE = 'mobile';
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
export const REFRESH_REUSE_GRACE_MS = 10_000;

export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '30d',
  REFRESH_TOKEN_BYTES: 32,
  RESET_TOKEN_EXPIRY_MS: 60 * 60 * 1000,
} as const;
