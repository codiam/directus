"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCollection = void 0;
const use_system_1 = require("./use-system");
const vue_1 = require("vue");
function useCollection(collectionKey) {
    const { useCollectionsStore, useFieldsStore } = (0, use_system_1.useStores)();
    const collectionsStore = useCollectionsStore();
    const fieldsStore = useFieldsStore();
    const collection = typeof collectionKey === 'string' ? (0, vue_1.ref)(collectionKey) : collectionKey;
    const info = (0, vue_1.computed)(() => {
        return (collectionsStore.collections.find(({ collection: key }) => key === collection.value) || null);
    });
    const fields = (0, vue_1.computed)(() => {
        if (!collection.value)
            return [];
        return fieldsStore.getFieldsForCollection(collection.value);
    });
    const defaults = (0, vue_1.computed)(() => {
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
    const primaryKeyField = (0, vue_1.computed)(() => {
        return (fields.value.find((field) => { var _a; return field.collection === collection.value && ((_a = field.schema) === null || _a === void 0 ? void 0 : _a.is_primary_key) === true; }) ||
            null);
    });
    const userCreatedField = (0, vue_1.computed)(() => {
        var _a;
        return ((_a = fields.value) === null || _a === void 0 ? void 0 : _a.find((field) => { var _a; return (((_a = field.meta) === null || _a === void 0 ? void 0 : _a.special) || []).includes('user_created'); })) || null;
    });
    const sortField = (0, vue_1.computed)(() => {
        var _a, _b;
        return ((_b = (_a = info.value) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.sort_field) || null;
    });
    const isSingleton = (0, vue_1.computed)(() => {
        var _a, _b;
        return ((_b = (_a = info.value) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.singleton) === true;
    });
    const accountabilityScope = (0, vue_1.computed)(() => {
        if (!info.value)
            return null;
        if (!info.value.meta)
            return null;
        return info.value.meta.accountability;
    });
    return { info, fields, defaults, primaryKeyField, userCreatedField, sortField, isSingleton, accountabilityScope };
}
exports.useCollection = useCollection;
