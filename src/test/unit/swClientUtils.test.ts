import { describe, expect, it, vi } from 'vitest';

import {
    createSharedClientUrl,
    persistSharedMediaIfPresent,
} from '../../lib/swClientUtils';

describe('swClientUtils', () => {
    it('createSharedClientUrl は shared=true を付けた URL を返す', () => {
        expect(createSharedClientUrl('/ehagaki/', 'https://example.com')).toBe(
            'https://example.com/ehagaki/?shared=true',
        );
    });

    it('persistSharedMediaIfPresent は cache がない時に何もしない', async () => {
        const persist = vi.fn();

        const result = await persistSharedMediaIfPresent({
            sharedCache: null,
            persist,
        });

        expect(result).toBe(false);
        expect(persist).not.toHaveBeenCalled();
    });

    it('persistSharedMediaIfPresent は成功時に callback を呼ぶ', async () => {
        const persist = vi.fn(async () => { });
        const onPersisted = vi.fn();

        const result = await persistSharedMediaIfPresent({
            sharedCache: { image: 'x' },
            persist,
            onPersisted,
        });

        expect(result).toBe(true);
        expect(persist).toHaveBeenCalledWith({ image: 'x' });
        expect(onPersisted).toHaveBeenCalledOnce();
    });

    it('persistSharedMediaIfPresent は失敗時に onError を呼ぶ', async () => {
        const error = new Error('persist failed');
        const onError = vi.fn();

        const result = await persistSharedMediaIfPresent({
            sharedCache: { image: 'x' },
            persist: vi.fn(async () => {
                throw error;
            }),
            onError,
        });

        expect(result).toBe(false);
        expect(onError).toHaveBeenCalledWith(error);
    });
});