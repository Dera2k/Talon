"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.hashToken = hashToken;
var node_crypto_1 = require("node:crypto");
function generateToken() {
    return (0, node_crypto_1.randomBytes)(32).toString('base64url');
}
function hashToken(token) {
    return (0, node_crypto_1.createHash)('sha256').update(token).digest('hex');
}
