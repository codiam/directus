import { Collection, Field } from '../types';
import { Ref, ComputedRef } from 'vue';
declare type UsableCollection = {
    info: ComputedRef<Collection | null>;
    fields: ComputedRef<Field[]>;
    defaults: Record<string, any>;
    primaryKeyField: ComputedRef<Field | null>;
    userCreatedField: ComputedRef<Field | null>;
    sortField: ComputedRef<string | null>;
    isSingleton: ComputedRef<boolean>;
    accountabilityScope: ComputedRef<'all' | 'activity' | null>;
};
export declare function useCollection(collectionKey: string | Ref<string | null>): UsableCollection;
export {};
//# sourceMappingURL=use-collection.d.ts.map