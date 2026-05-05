import { describe, expect, it, vi } from 'vitest';

import {
    resolveUploadRequestOutcome,
    summarizeExtractedSharedMedia,
} from '../../lib/swUploadRequestUtils';

describe('swUploadRequestUtils', () => {
    it('summarizeExtractedSharedMedia は images の概要を返す', () => {
        expect(
            summarizeExtractedSharedMedia({
                images: [{ type: 'image/png', size: 123 }],
            }),
        ).toEqual({
            hasImages: true,
            imageCount: 1,
            firstImageType: 'image/png',
            firstImageSize: 123,
        });
    });

    it('resolveUploadRequestOutcome は media がない時に no-image redirect を返す', async () => {
        const createRedirectResponse = vi.fn(() => new Response(null, { status: 303 }));
        const redirectClient = vi.fn();
        const setSharedMediaCache = vi.fn();

        const result = await resolveUploadRequestOutcome({
            extractedData: null,
            location: { origin: 'https://example.com' } as Location,
            redirectClient,
            createRedirectResponse,
            setSharedMediaCache,
        });

        expect(result.status).toBe(303);
        expect(createRedirectResponse).toHaveBeenCalledWith(
            undefined,
            'no-image',
            { origin: 'https://example.com' },
        );
        expect(redirectClient).not.toHaveBeenCalled();
        expect(setSharedMediaCache).not.toHaveBeenCalled();
    });

    it('resolveUploadRequestOutcome は media を cache して redirectClient を呼ぶ', async () => {
        const redirectResponse = new Response(null, { status: 200 });
        const redirectClient = vi.fn(async () => redirectResponse);
        const setSharedMediaCache = vi.fn();
        const media = { images: [{ type: 'image/png', size: 123 }] };

        const result = await resolveUploadRequestOutcome({
            extractedData: media,
            location: { origin: 'https://example.com' } as Location,
            redirectClient,
            createRedirectResponse: vi.fn(),
            setSharedMediaCache,
        });

        expect(result).toBe(redirectResponse);
        expect(setSharedMediaCache).toHaveBeenCalledWith(media);
        expect(redirectClient).toHaveBeenCalledOnce();
    });
});