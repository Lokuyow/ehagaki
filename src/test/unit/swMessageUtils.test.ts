import { describe, expect, it, vi } from 'vitest';

import {
    createClientSharedMediaNotification,
    createSharedMediaMessage,
    postSharedMediaMessage,
} from '../../lib/swMessageUtils';

describe('swMessageUtils', () => {
    it('createSharedMediaMessage は requestId と timestamp を保持する', () => {
        const result = createSharedMediaMessage({
            data: { image: 'x' },
            requestId: 'req-1',
            timestamp: 123,
        });

        expect(result).toEqual({
            type: 'SHARED_MEDIA',
            data: { image: 'x' },
            requestId: 'req-1',
            timestamp: 123,
        });
    });

    it('createSharedMediaMessage は fallbackRequired が必要な時だけ付与する', () => {
        const result = createSharedMediaMessage({
            data: null,
            requestId: null,
            timestamp: 456,
            fallbackRequired: true,
        });

        expect(result).toEqual({
            type: 'SHARED_MEDIA',
            data: null,
            requestId: null,
            timestamp: 456,
            fallbackRequired: true,
        });
    });

    it('createClientSharedMediaNotification は同じ timestamp を requestId に使う', () => {
        const result = createClientSharedMediaNotification({ image: 'x' }, 789);

        expect(result).toEqual({
            type: 'SHARED_MEDIA',
            data: { image: 'x' },
            requestId: 'sw-789',
            timestamp: 789,
        });
    });

    it('postSharedMediaMessage は port を優先して送信する', () => {
        const portPostMessage = vi.fn();
        const sourcePostMessage = vi.fn();
        const message = createSharedMediaMessage({ data: 'x', timestamp: 1 });

        const result = postSharedMediaMessage(
            {
                ports: [{ postMessage: portPostMessage }],
                source: { postMessage: sourcePostMessage },
            },
            message,
        );

        expect(result).toBe('port');
        expect(portPostMessage).toHaveBeenCalledWith(message);
        expect(sourcePostMessage).not.toHaveBeenCalled();
    });

    it('postSharedMediaMessage は source fallback を使う', () => {
        const sourcePostMessage = vi.fn();
        const message = createSharedMediaMessage({ data: 'x', timestamp: 1 });

        const result = postSharedMediaMessage(
            {
                source: { postMessage: sourcePostMessage },
            },
            message,
        );

        expect(result).toBe('source');
        expect(sourcePostMessage).toHaveBeenCalledWith(message);
    });
});