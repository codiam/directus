import BaseJoi from 'joi';
import { escapeRegExp, merge } from 'lodash';
export const Joi = BaseJoi.extend({
    type: 'string',
    base: BaseJoi.string(),
    messages: {
        'string.contains': '{{#label}} must contain [{{#substring}}]',
        'string.ncontains': "{{#label}} can't contain [{{#substring}}]",
    },
    rules: {
        contains: {
            args: [
                {
                    name: 'substring',
                    ref: true,
                    assert: (val) => typeof val === 'string',
                    message: 'must be a string',
                },
            ],
            method(substring) {
                return this.$_addRule({ name: 'contains', args: { substring } });
            },
            validate(value, helpers, { substring }) {
                if (value.includes(substring) === false) {
                    return helpers.error('string.contains', { substring });
                }
                return value;
            },
        },
        ncontains: {
            args: [
                {
                    name: 'substring',
                    ref: true,
                    assert: (val) => typeof val === 'string',
                    message: 'must be a string',
                },
            ],
            method(substring) {
                return this.$_addRule({ name: 'ncontains', args: { substring } });
            },
            validate(value, helpers, { substring }) {
                if (value.includes(substring) === true) {
                    return helpers.error('string.ncontains', { substring });
                }
                return value;
            },
        },
    },
});
const defaults = {
    requireAll: false,
};
/**
 * Generate a Joi schema from a filter object.
 *
 * @param {FieldFilter} filter - Field filter object. Note: does not support _and/_or filters.
 * @param {JoiOptions} [options] - Options for the schema generation.
 * @returns {AnySchema} Joi schema.
 */
export function generateJoi(filter, options) {
    var _a, _b;
    filter = filter || {};
    options = merge({}, defaults, options);
    const schema = {};
    const key = Object.keys(filter)[0];
    if (!key) {
        throw new Error(`[generateJoi] Filter doesn't contain field key. Passed filter: ${JSON.stringify(filter)}`);
    }
    const value = Object.values(filter)[0];
    if (!value) {
        throw new Error(`[generateJoi] Filter doesn't contain filter rule. Passed filter: ${JSON.stringify(filter)}`);
    }
    if (((_a = Object.keys(value)[0]) === null || _a === void 0 ? void 0 : _a.startsWith('_')) === false) {
        schema[key] = Joi.object({
            [key]: generateJoi(value, options),
        });
    }
    else {
        const operator = Object.keys(value)[0];
        const compareValue = Object.values(value)[0];
        const getAnySchema = () => { var _a; return (_a = schema[key]) !== null && _a !== void 0 ? _a : Joi.any(); };
        const getStringSchema = () => { var _a; return ((_a = schema[key]) !== null && _a !== void 0 ? _a : Joi.string()); };
        const getNumberSchema = () => { var _a; return ((_a = schema[key]) !== null && _a !== void 0 ? _a : Joi.number()); };
        const getDateSchema = () => { var _a; return ((_a = schema[key]) !== null && _a !== void 0 ? _a : Joi.date()); };
        if (operator === '_eq') {
            schema[key] = getAnySchema().equal(compareValue);
        }
        if (operator === '_neq') {
            schema[key] = getAnySchema().not(compareValue);
        }
        if (operator === '_contains') {
            schema[key] = getStringSchema().contains(compareValue);
        }
        if (operator === '_ncontains') {
            schema[key] = getStringSchema().ncontains(compareValue);
        }
        if (operator === '_starts_with') {
            schema[key] = getStringSchema().pattern(new RegExp(`^${escapeRegExp(compareValue)}.*`), {
                name: 'starts_with',
            });
        }
        if (operator === '_nstarts_with') {
            schema[key] = getStringSchema().pattern(new RegExp(`^${escapeRegExp(compareValue)}.*`), {
                name: 'starts_with',
                invert: true,
            });
        }
        if (operator === '_ends_with') {
            schema[key] = getStringSchema().pattern(new RegExp(`.*${escapeRegExp(compareValue)}$`), {
                name: 'ends_with',
            });
        }
        if (operator === '_nends_with') {
            schema[key] = getStringSchema().pattern(new RegExp(`.*${escapeRegExp(compareValue)}$`), {
                name: 'ends_with',
                invert: true,
            });
        }
        if (operator === '_in') {
            schema[key] = getAnySchema().equal(...compareValue);
        }
        if (operator === '_nin') {
            schema[key] = getAnySchema().not(...compareValue);
        }
        if (operator === '_gt') {
            schema[key] = Number.isSafeInteger(compareValue)
                ? getNumberSchema().greater(compareValue)
                : getDateSchema().greater(compareValue);
        }
        if (operator === '_gte') {
            schema[key] = Number.isSafeInteger(compareValue)
                ? getNumberSchema().min(compareValue)
                : getDateSchema().min(compareValue);
        }
        if (operator === '_lt') {
            schema[key] = Number.isSafeInteger(compareValue)
                ? getNumberSchema().less(compareValue)
                : getDateSchema().less(compareValue);
        }
        if (operator === '_lte') {
            schema[key] = Number.isSafeInteger(compareValue)
                ? getNumberSchema().max(compareValue)
                : getDateSchema().max(compareValue);
        }
        if (operator === '_null') {
            schema[key] = getAnySchema().valid(null);
        }
        if (operator === '_nnull') {
            schema[key] = getAnySchema().invalid(null);
        }
        if (operator === '_empty') {
            schema[key] = getAnySchema().valid('');
        }
        if (operator === '_nempty') {
            schema[key] = getAnySchema().invalid('');
        }
        if (operator === '_between') {
            if (compareValue.every((value) => Number.isSafeInteger(value))) {
                const values = compareValue;
                schema[key] = getNumberSchema().greater(values[0]).less(values[1]);
            }
            else {
                const values = compareValue;
                schema[key] = getDateSchema().greater(values[0]).less(values[1]);
            }
        }
        if (operator === '_nbetween') {
            if (compareValue.every((value) => Number.isSafeInteger(value))) {
                const values = compareValue;
                schema[key] = getNumberSchema().less(values[0]).greater(values[1]);
            }
            else {
                const values = compareValue;
                schema[key] = getDateSchema().less(values[0]).greater(values[1]);
            }
        }
        if (operator === '_submitted') {
            schema[key] = getAnySchema().required();
        }
        if (operator === '_regex') {
            const wrapped = compareValue.startsWith('/') && compareValue.endsWith('/');
            schema[key] = getStringSchema().regex(new RegExp(wrapped ? compareValue.slice(1, -1) : compareValue));
        }
    }
    schema[key] = (_b = schema[key]) !== null && _b !== void 0 ? _b : Joi.any();
    if (options.requireAll) {
        schema[key] = schema[key].required();
    }
    return Joi.object(schema).unknown();
}
