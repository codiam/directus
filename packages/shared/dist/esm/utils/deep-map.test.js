import { deepMap } from './deep-map';
describe('deepMap', () => {
    const mockIterator = (val, _key) => {
        return `Test ${val}`;
    };
    it('returns an object mapped where values are the return of the iterator', () => {
        const mockObject = { _and: [{ field: { _eq: 'field' } }] };
        expect(deepMap(mockObject, mockIterator)).toStrictEqual({ _and: [{ field: { _eq: 'Test field' } }] });
    });
    it('returns object param when passed neither an object or an array.', () => {
        const mockObject = 'test string';
        expect(deepMap(mockObject, mockIterator)).toBe(mockObject);
    });
    it('returns an array of the iterators vals', () => {
        const mockObject = ['test', 'test2'];
        expect(deepMap(mockObject, mockIterator)).toStrictEqual(['Test test', 'Test test2']);
    });
});
