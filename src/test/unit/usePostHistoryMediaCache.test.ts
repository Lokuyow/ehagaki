import { describe, expect, it } from 'vitest';

import {
    buildResolvedPostHistoryMediaBaseItem,
} from '../../lib/hooks/usePostHistoryMediaCache.svelte';

describe('usePostHistoryMediaCache', () => {
    it('base item に imeta 由来の表示ヒントを保持する', () => {
        const result = buildResolvedPostHistoryMediaBaseItem({
            url: 'https://example.com/media/image.webp',
            mimeType: 'image/webp',
            alt: 'sample alt',
            blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
            dim: '1200x800',
            size: 1234,
            uploadProtocol: 'blossom',
        });

        expect(result).toMatchObject({
            url: 'https://example.com/media/image.webp',
            mimeType: 'image/webp',
            alt: 'sample alt',
            blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
            dim: '1200x800',
            size: 1234,
            uploadProtocol: 'blossom',
            kind: 'image',
            hasResolvedCache: false,
            cached: false,
            isLoadingPreview: false,
            isCaching: false,
            hasFetchFailed: false,
        });
    });
});