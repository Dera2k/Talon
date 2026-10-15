"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalDateKey = getLocalDateKey;
exports.isValidTimezone = isValidTimezone;
function getLocalDateKey(timezone, date) {
    if (date === void 0) { date = new Date(); }
    var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);
    var value = Object.fromEntries(parts
        .filter(function (_a) {
        var type = _a.type;
        return type !== 'literal';
    })
        .map(function (_a) {
        var type = _a.type, value = _a.value;
        return [type, value];
    }));
    return "".concat(value.year, "-").concat(value.month, "-").concat(value.day);
}
function isValidTimezone(timezone) {
    try {
        new Intl.DateTimeFormat('en-CA', { timeZone: timezone });
        return true;
    }
    catch (_a) {
        return false;
    }
}
