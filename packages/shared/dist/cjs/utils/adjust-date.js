"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustDate = void 0;
const date_fns_1 = require("date-fns");
const lodash_1 = require("lodash");
/**
 * Adjust a given date by a given change in duration. The adjustment value uses the exact same syntax
 * and logic as Vercel's `ms`.
 *
 * The conversion is lifted straight from `ms`.
 */
function adjustDate(date, adjustment) {
    var _a;
    date = (0, lodash_1.clone)(date);
    const match = /^((?:-|\+)?\d*?\.?\d+?) *?(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mth|mo|years?|yrs?|y)?$/i.exec(adjustment.trim());
    if (!match || !match[1])
        return;
    const amount = parseFloat(match[1]);
    const type = ((_a = match[2]) !== null && _a !== void 0 ? _a : 'days').toLowerCase();
    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return (0, date_fns_1.addYears)(date, amount);
        case 'months':
        case 'month':
        case 'mth':
        case 'mo':
            return (0, date_fns_1.addMonths)(date, amount);
        case 'weeks':
        case 'week':
        case 'w':
            return (0, date_fns_1.addWeeks)(date, amount);
        case 'days':
        case 'day':
        case 'd':
            return (0, date_fns_1.addDays)(date, amount);
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return (0, date_fns_1.addHours)(date, amount);
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return (0, date_fns_1.addMinutes)(date, amount);
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return (0, date_fns_1.addSeconds)(date, amount);
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return (0, date_fns_1.addMilliseconds)(date, amount);
        default:
            return undefined;
    }
}
exports.adjustDate = adjustDate;
