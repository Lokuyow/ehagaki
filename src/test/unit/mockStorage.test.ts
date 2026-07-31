import { describe, expect, it } from 'vitest';
import { MockStorage } from '../helpers';

describe('MockStorage', () => {
    it('stores and retrieves normal keys and values', () => {
        const storage = new MockStorage();

        storage.setItem('key', 'value');

        expect(storage.getItem('key')).toBe('value');
        expect(storage.length).toBe(1);
        expect(storage.key(0)).toBe('key');
    });

    it('preserves empty-string values and empty-string keys', () => {
        const storage = new MockStorage();
        storage.setItem('key', '');

        expect(storage.getItem('key')).toBe('');
        expect(storage.length).toBe(1);
        expect(storage.key(0)).toBe('key');

        const storageWithEmptyKey = new MockStorage();
        storageWithEmptyKey.setItem('', 'value');

        expect(storageWithEmptyKey.getItem('')).toBe('value');
        expect(storageWithEmptyKey.length).toBe(1);
        expect(storageWithEmptyKey.key(0)).toBe('');
    });

    it('returns null for missing keys and out-of-range indexes', () => {
        const storage = new MockStorage();

        expect(storage.getItem('missing')).toBeNull();
        expect(storage.key(0)).toBeNull();
        expect(storage.key(1)).toBeNull();
        expect(storage.key(-1)).toBeNull();
    });

    it('updates length and contents after removeItem and clear', () => {
        const storage = new MockStorage();
        storage.setItem('first', 'one');
        storage.setItem('second', 'two');

        storage.removeItem('first');

        expect(storage.length).toBe(1);
        expect(storage.getItem('first')).toBeNull();
        expect(storage.getItem('second')).toBe('two');
        expect(storage.key(0)).toBe('second');

        storage.clear();

        expect(storage.length).toBe(0);
        expect(storage.getItem('second')).toBeNull();
        expect(storage.key(0)).toBeNull();
    });
});
