"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.durationToMs = durationToMs;
var UNIT_MS = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
function durationToMs(value) {
    var match = /^(\d+)([smhd])$/.exec(value);
    if (!match) {
        throw new Error("Invalid duration \"".concat(value, "\", expected e.g. \"7d\""));
    }
    return Number(match[1]) * UNIT_MS[match[2]];
}
