import { FilterOperator } from './filter';
import { DeepPartial } from './misc';
import { Column } from 'knex-schema-inspector/dist/types/column';
import { LOCAL_TYPES, TYPES, GEOMETRY_TYPES, GEOMETRY_FORMATS } from '../constants';
declare type Translations = {
    language: string;
    translation: string;
};
export declare type Width = 'half' | 'half-left' | 'half-right' | 'full' | 'fill';
export declare type Type = typeof TYPES[number];
export declare type LocalType = typeof LOCAL_TYPES[number];
export declare type GeometryType = typeof GEOMETRY_TYPES[number] | 'GeometryCollection' | undefined;
export declare type GeometryFormat = typeof GEOMETRY_FORMATS[number];
export declare type FieldMeta = {
    id: number;
    collection: string;
    field: string;
    group: string | null;
    hidden: boolean;
    interface: string | null;
    display: string | null;
    options: Record<string, any> | null;
    display_options: Record<string, any> | null;
    readonly: boolean;
    required: boolean;
    sort: number | null;
    special: string[] | null;
    translations: Translations[] | null;
    width: Width | null;
    note: string | null;
    conditions: Condition[] | null;
    system?: true;
};
export interface FieldRaw {
    collection: string;
    field: string;
    type: Type;
    schema: Column | null;
    meta: FieldMeta | null;
}
export interface Field extends FieldRaw {
    name: string;
    children?: Field[] | null;
}
export declare type RawField = DeepPartial<Field> & {
    field: string;
    type: Type;
};
export declare type ValidationError = {
    code: string;
    field: string;
    type: FilterOperator;
    valid?: number | string | (number | string)[];
    invalid?: number | string | (number | string)[];
    substring?: string;
};
export declare type Condition = {
    name: string;
    rule: Record<string, any>;
    readonly?: boolean;
    hidden?: boolean;
    options?: Record<string, any>;
    required?: boolean;
};
export {};
//# sourceMappingURL=fields.d.ts.map