export declare type FilterOperator = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'nin' | 'null' | 'nnull' | 'contains' | 'ncontains' | 'between' | 'nbetween' | 'empty' | 'nempty' | 'intersects' | 'nintersects' | 'intersects_bbox' | 'nintersects_bbox';
export declare type ClientFilterOperator = FilterOperator | 'starts_with' | 'nstarts_with' | 'ends_with' | 'nends_with';
export declare type Filter = LogicalFilter | FieldFilter;
export declare type LogicalFilterOR = {
    _or: Filter[];
};
export declare type LogicalFilterAND = {
    _and: Filter[];
};
export declare type LogicalFilter = LogicalFilterOR | LogicalFilterAND;
export declare type FieldFilter = {
    [field: string]: FieldFilterOperator | FieldValidationOperator | FieldFilter;
};
export declare type FieldFilterOperator = {
    _eq?: string | number | boolean;
    _neq?: string | number | boolean;
    _lt?: string | number;
    _lte?: string | number;
    _gt?: string | number;
    _gte?: string | number;
    _in?: (string | number)[];
    _nin?: (string | number)[];
    _null?: boolean;
    _nnull?: boolean;
    _contains?: string;
    _ncontains?: string;
    _starts_with?: string;
    _nstarts_with?: string;
    _ends_with?: string;
    _nends_with?: string;
    _between?: (string | number)[];
    _nbetween?: (string | number)[];
    _empty?: boolean;
    _nempty?: boolean;
    _intersects?: string;
    _nintersects?: string;
    _intersects_bbox?: string;
    _nintersects_bbox?: string;
};
export declare type FieldValidationOperator = {
    _submitted?: boolean;
    _regex?: string;
};
//# sourceMappingURL=filter.d.ts.map