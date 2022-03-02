"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItems = void 0;
const use_system_1 = require("./use-system");
const axios_1 = __importDefault(require("axios"));
const use_collection_1 = require("./use-collection");
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
const vue_1 = require("vue");
function useItems(collection, query, fetchOnInit = true) {
    const api = (0, use_system_1.useApi)();
    const { primaryKeyField } = (0, use_collection_1.useCollection)(collection);
    const { fields, limit, sort, search, filter, page } = query;
    const endpoint = (0, vue_1.computed)(() => {
        if (!collection.value)
            return null;
        return collection.value.startsWith('directus_')
            ? `/${collection.value.substring(9)}`
            : `/items/${collection.value}`;
    });
    const items = (0, vue_1.ref)([]);
    const loading = (0, vue_1.ref)(false);
    const error = (0, vue_1.ref)(null);
    const itemCount = (0, vue_1.ref)(null);
    const totalCount = (0, vue_1.ref)(null);
    const totalPages = (0, vue_1.computed)(() => {
        var _a, _b;
        if (itemCount.value === null)
            return 1;
        if (itemCount.value < ((_a = (0, vue_1.unref)(limit)) !== null && _a !== void 0 ? _a : 100))
            return 1;
        return Math.ceil(itemCount.value / ((_b = (0, vue_1.unref)(limit)) !== null && _b !== void 0 ? _b : 100));
    });
    let currentRequest = null;
    let loadingTimeout = null;
    const fetchItems = (0, lodash_1.throttle)(getItems, 500);
    if (fetchOnInit) {
        fetchItems();
    }
    (0, vue_1.watch)([collection, limit, sort, search, filter, fields, page], async (after, before) => {
        if ((0, lodash_1.isEqual)(after, before))
            return;
        const [newCollection, newLimit, newSort, newSearch, newFilter, _newFields, _newPage] = after;
        const [oldCollection, oldLimit, oldSort, oldSearch, oldFilter, _oldFields, _oldPage] = before;
        if (!newCollection || !query)
            return;
        if (!(0, lodash_1.isEqual)(newFilter, oldFilter) ||
            !(0, lodash_1.isEqual)(newSort, oldSort) ||
            newLimit !== oldLimit ||
            newSearch !== oldSearch) {
            if (oldCollection) {
                page.value = 1;
            }
        }
        if (newCollection !== oldCollection) {
            reset();
        }
        fetchItems();
    }, { deep: true, immediate: true });
    return { itemCount, totalCount, items, totalPages, loading, error, changeManualSort, getItems };
    async function getItems() {
        var _a, _b;
        if (!endpoint.value)
            return;
        currentRequest === null || currentRequest === void 0 ? void 0 : currentRequest.cancel();
        currentRequest = null;
        error.value = null;
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }
        loadingTimeout = setTimeout(() => {
            loading.value = true;
        }, 150);
        let fieldsToFetch = [...((_a = (0, vue_1.unref)(fields)) !== null && _a !== void 0 ? _a : [])];
        // Make sure the primary key is always fetched
        if (!((_b = (0, vue_1.unref)(fields)) === null || _b === void 0 ? void 0 : _b.includes('*')) &&
            primaryKeyField.value &&
            fieldsToFetch.includes(primaryKeyField.value.field) === false) {
            fieldsToFetch.push(primaryKeyField.value.field);
        }
        // Filter out fake internal columns. This is (among other things) for a fake $thumbnail m2o field
        // on directus_files
        fieldsToFetch = fieldsToFetch.filter((field) => field.startsWith('$') === false);
        try {
            currentRequest = axios_1.default.CancelToken.source();
            const response = await api.get(endpoint.value, {
                params: {
                    limit: (0, vue_1.unref)(limit),
                    fields: fieldsToFetch,
                    sort: (0, vue_1.unref)(sort),
                    page: (0, vue_1.unref)(page),
                    search: (0, vue_1.unref)(search),
                    filter: (0, vue_1.unref)(filter),
                    meta: ['filter_count', 'total_count'],
                },
                cancelToken: currentRequest.token,
            });
            let fetchedItems = response.data.data;
            /**
             * @NOTE
             *
             * This is used in conjunction with the fake field in /src/stores/fields/fields.ts to be
             * able to render out the directus_files collection (file library) using regular layouts
             *
             * Layouts expect the file to be a m2o of a `file` type, however, directus_files is the
             * only collection that doesn't have this (obviously). This fake $thumbnail field is used to
             * pretend there is a file m2o, so we can use the regular layout logic for files as well
             */
            if (collection.value === 'directus_files') {
                fetchedItems = fetchedItems.map((file) => ({
                    ...file,
                    $thumbnail: file,
                }));
            }
            items.value = fetchedItems;
            totalCount.value = response.data.meta.total_count;
            itemCount.value = response.data.meta.filter_count;
            if (page && fetchedItems.length === 0 && (page === null || page === void 0 ? void 0 : page.value) !== 1) {
                page.value = 1;
            }
        }
        catch (err) {
            if (!axios_1.default.isCancel(err)) {
                error.value = err;
            }
        }
        finally {
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
                loadingTimeout = null;
            }
            loading.value = false;
        }
    }
    function reset() {
        items.value = [];
        totalCount.value = null;
        itemCount.value = null;
    }
    async function changeManualSort({ item, to }) {
        var _a;
        const pk = (_a = primaryKeyField.value) === null || _a === void 0 ? void 0 : _a.field;
        if (!pk)
            return;
        const fromIndex = items.value.findIndex((existing) => existing[pk] === item);
        const toIndex = items.value.findIndex((existing) => existing[pk] === to);
        items.value = (0, utils_1.moveInArray)(items.value, fromIndex, toIndex);
        const endpoint = (0, vue_1.computed)(() => `/utils/sort/${collection.value}`);
        await api.post(endpoint.value, { item, to });
    }
}
exports.useItems = useItems;
