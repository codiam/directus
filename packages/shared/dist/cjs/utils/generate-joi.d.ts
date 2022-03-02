import BaseJoi, { AnySchema, StringSchema as BaseStringSchema } from 'joi';
import { FieldFilter } from '../types/filter';
export interface StringSchema extends BaseStringSchema {
    contains(substring: string): this;
    ncontains(substring: string): this;
}
export declare const Joi: typeof BaseJoi;
export declare type JoiOptions = {
    requireAll?: boolean;
};
/**
 * Generate a Joi schema from a filter object.
 *
 * @param {FieldFilter} filter - Field filter object. Note: does not support _and/_or filters.
 * @param {JoiOptions} [options] - Options for the schema generation.
 * @returns {AnySchema} Joi schema.
 */
export declare function generateJoi(filter: FieldFilter, options?: JoiOptions): AnySchema;
//# sourceMappingURL=generate-joi.d.ts.map