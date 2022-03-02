import { REGEX_BETWEEN_PARENS } from '../constants';
import { toArray } from './to-array';
import { adjustDate } from './adjust-date';
import { isDynamicVariable } from './is-dynamic-variable';
import { isObjectLike } from 'lodash';
import { deepMap } from './deep-map';
export function parseFilter(filter, accountability, context = {}) {
    var _a;
    if (filter === null || filter === undefined) {
        return null;
    }
    if (!isObjectLike(filter)) {
        return { _eq: parseFilterValue(filter, accountability, context) };
    }
    const filters = Object.entries(filter).map((entry) => parseFilterEntry(entry, accountability, context));
    if (filters.length === 0) {
        return {};
    }
    else if (filters.length === 1) {
        return (_a = filters[0]) !== null && _a !== void 0 ? _a : null;
    }
    else {
        return { _and: filters };
    }
}
export function parsePreset(preset, accountability, context) {
    if (!preset)
        return preset;
    return deepMap(preset, (value) => parseFilterValue(value, accountability, context));
}
function parseFilterEntry([key, value], accountability, context) {
    if (['_or', '_and'].includes(String(key))) {
        return { [key]: value.map((filter) => parseFilter(filter, accountability, context)) };
    }
    else if (['_in', '_nin', '_between', '_nbetween'].includes(String(key))) {
        return { [key]: toArray(value).flatMap((value) => parseFilterValue(value, accountability, context)) };
    }
    else if (String(key).startsWith('_')) {
        return { [key]: parseFilterValue(value, accountability, context) };
    }
    else {
        return { [key]: parseFilter(value, accountability, context) };
    }
}
function parseFilterValue(value, accountability, context) {
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    if (value === 'null' || value === 'NULL')
        return null;
    if (isDynamicVariable(value))
        return parseDynamicVariable(value, accountability, context);
    return value;
}
function parseDynamicVariable(value, accountability, context) {
    var _a, _b, _c;
    if (value.startsWith('$NOW')) {
        if (value.includes('(') && value.includes(')')) {
            const adjustment = (_a = value.match(REGEX_BETWEEN_PARENS)) === null || _a === void 0 ? void 0 : _a[1];
            if (!adjustment)
                return new Date();
            return adjustDate(new Date(), adjustment);
        }
        return new Date();
    }
    if (value.startsWith('$CURRENT_USER')) {
        if (value === '$CURRENT_USER')
            return (_b = accountability === null || accountability === void 0 ? void 0 : accountability.user) !== null && _b !== void 0 ? _b : null;
        return get(context, value, null);
    }
    if (value.startsWith('$CURRENT_ROLE')) {
        if (value === '$CURRENT_ROLE')
            return (_c = accountability === null || accountability === void 0 ? void 0 : accountability.role) !== null && _c !== void 0 ? _c : null;
        return get(context, value, null);
    }
}
function get(object, path, defaultValue) {
    const [key, ...follow] = path.split('.');
    const result = Array.isArray(object) ? object.map((entry) => entry[key]) : object === null || object === void 0 ? void 0 : object[key];
    if (follow.length > 0) {
        return get(result, follow.join('.'), defaultValue);
    }
    return result !== null && result !== void 0 ? result : defaultValue;
}
