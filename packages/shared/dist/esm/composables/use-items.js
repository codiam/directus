import { useApi } from './use-system';
import axios from 'axios';
import { useCollection } from './use-collection';
import { moveInArray } from '../utils';
import { isEqual, throttle } from 'lodash';
import { computed, ref, watch, unref } from 'vue';
export function useItems(collection, query, fetchOnInit = true) {
    const api = useApi();
    const { primaryKeyField } = useCollection(collection);
    const { fields, limit, sort, search, filter, page } = query;
    const endpoint = computed(() => {
        if (!collection.value)
            return null;
        return collection.value.startsWith('directus_')
            ? `/${collection.value.substring(9)}`
            : `/items/${collection.value}`;
    });
    const items = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const itemCount = ref(null);
    const totalCount = ref(null);
    const totalPages = computed(() => {
        var _a, _b;
        if (itemCount.value === null)
            return 1;
        if (itemCount.value < ((_a = unref(limit)) !== null && _a !== void 0 ? _a : 100))
            return 1;
        return Math.ceil(itemCount.value / ((_b = unref(limit)) !== null && _b !== void 0 ? _b : 100));
    });
    let currentRequest = null;
    let loadingTimeout = null;
    const fetchItems = throttle(getItems, 500);
    if (fetchOnInit) {
        fetchItems();
    }
    watch([collection, limit, sort, search, filter, fields, page], async (after, before) => {
        if (isEqual(after, before))
            return;
        const [newCollection, newLimit, newSort, newSearch, newFilter, _newFields, _newPage] = after;
        const [oldCollection, oldLimit, oldSort, oldSearch, oldFilter, _oldFields, _oldPage] = before;
        if (!newCollection || !query)
            return;
        if (!isEqual(newFilter, oldFilter) ||
            !isEqual(newSort, oldSort) ||
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
        let fieldsToFetch = [...((_a = unref(fields)) !== null && _a !== void 0 ? _a : [])];
        // Make sure the primary key is always fetched
        if (!((_b = unref(fields)) === null || _b === void 0 ? void 0 : _b.includes('*')) &&
            primaryKeyField.value &&
            fieldsToFetch.includes(primaryKeyField.value.field) === false) {
            fieldsToFetch.push(primaryKeyField.value.field);
        }
        // Filter out fake internal columns. This is (among other things) for a fake $thumbnail m2o field
        // on directus_files
        fieldsToFetch = fieldsToFetch.filter((field) => field.startsWith('$') === false);
        try {
            currentRequest = axios.CancelToken.source();
            const response = await api.get(endpoint.value, {
                params: {
                    limit: unref(limit),
                    fields: fieldsToFetch,
                    sort: unref(sort),
                    page: unref(page),
                    search: unref(search),
                    filter: unref(filter),
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
            if (!axios.isCancel(err)) {
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
        items.value = moveInArray(items.value, fromIndex, toIndex);
        const endpoint = computed(() => `/utils/sort/${collection.value}`);
        await api.post(endpoint.value, { item, to });
    }
}
