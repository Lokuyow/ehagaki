import { describe, expect, it, vi } from 'vitest';

import { postServiceWorkerSharedMediaResponse } from '../../lib/swSharedMediaResponseUtils';

describe('swSharedMediaResponseUtils', () => {
    it('postServiceWorkerSharedMediaResponse clears shared media only when requested and available', () => {
        const postMessage = vi.fn();
        const clearSharedMediaCache = vi.fn();
        const clearPersistedSharedMedia = vi.fn();

        const result = postServiceWorkerSharedMediaResponse({
            event: {
                data: { requestId: 'req-1' },
                source: { postMessage },
            },
            sharedMedia: { image: 'x' },
            clearAfterSend: true,
            clearSharedMediaCache,
            clearPersistedSharedMedia,
        });

        expect(result).toEqual({ image: 'x' });
        expect(postMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'SHARED_MEDIA',
                data: { image: 'x' },
                requestId: 'req-1',
            }),
        );
        expect(clearSharedMediaCache).toHaveBeenCalledTimes(1);
        expect(clearPersistedSharedMedia).toHaveBeenCalledTimes(1);
    });

    it('postServiceWorkerSharedMediaResponse keeps cache for force fallback responses', () => {
        const postMessage = vi.fn();
        const clearSharedMediaCache = vi.fn();
        const clearPersistedSharedMedia = vi.fn();

        const result = postServiceWorkerSharedMediaResponse({
            event: {
                data: { requestId: 'req-2' },
                ports: [{ postMessage }],
            },
            sharedMedia: null,
            fallbackRequired: true,
            clearSharedMediaCache,
            clearPersistedSharedMedia,
        });

        expect(result).toBeNull();
        expect(postMessage).toHaveBeenCalledWith({
            type: 'SHARED_MEDIA',
            data: null,
            requestId: 'req-2',
            timestamp: expect.any(Number),
            fallbackRequired: true,
        });
        expect(clearSharedMediaCache).not.toHaveBeenCalled();
        expect(clearPersistedSharedMedia).not.toHaveBeenCalled();
    });
});