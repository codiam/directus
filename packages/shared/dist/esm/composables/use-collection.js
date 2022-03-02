import { useStores } from './use-system';
import { computed, ref } from 'vue';
export function useCollection(collectionKey) {
    const { useCollectionsStore, useFieldsStore } = useStores();
    const collectionsStore = useCollectionsStore();
    const fieldsStore = useFieldsStore();
    const collection = typeof collectionKey === 'string' ? ref(collectionKey) : collectionKey;
    const info = computed(() => {
        return (collectionsStore.collections.find(({ collection: key }) => key === collection.value) || null);
    });
    const fields = computed(() => {
        if (!collection.value)
            return [];
        return fieldsStore.getFieldsForCollection(collection.value);
    });
    const defaults = computed(() => {
        var _a;
        if (!fields.value)
            return {};
        const defaults = {};
        for (const field of fields.value) {
            if ((_a = field.schema) === null || _a === void 0 ? void 0 : _a.default_value) {
                defaults[field.field] = field.schema.default_value;
            }
        }
        return defaults;
    });
    const primaryKeyField = computed(() => {
        return (fields.value.find((field) => { var _a; return field.collection === collection.value && ((_a = field.schema) === null || _a === void 0 ? void 0 : _a.is_primary_key) === true; }) ||
            null);
    });
    const userCreatedField = computed(() => {
        var _a;
        return ((_a = fields.value) === null || _a === void 0 ? void 0 : _a.find((field) => { var _a; return (((_a = field.meta) === null || _a === void 0 ? void 0 : _a.special) || []).includes('user_created'); })) || null;
    });
    const sortField = computed(() => {
        var _a, _b;
        return ((_b = (_a = info.value) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.sort_field) || null;
    });
    const isSingleton = computed(() => {
        var _a, _b;
        return ((_b = (_a = info.value) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.singleton) === true;
    });
    const accountabilityScope = computed(() => {
        if (!info.value)
            return null;
        if (!info.value.meta)
            return null;
        return info.value.meta.accountability;
    });
    return { info, fields, defaults, primaryKeyField, userCreatedField, sortField, isSingleton, accountabilityScope };
}
