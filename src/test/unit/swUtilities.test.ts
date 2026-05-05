import { describe, expect, it } from 'vitest';

import {
    createCorsRequest,
    createServiceWorkerRedirectResponse,
    createTransparentImageResponse,
    extractSharedMediaFromFormData,
} from '../../lib/swUtilities';

describe('swUtilities', () => {
    it('createTransparentImageResponse は PNG response を返す', async () => {
        const response = createTransparentImageResponse();

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('image/png');
        expect(response.headers.get('Cache-Control')).toBe('max-age=31536000');
        expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(8);
    });

    it('createCorsRequest は Accept header を付与しつつ追加 header を保持する', () => {
        const request = createCorsRequest('https://example.com/image.png', {
            headers: {
                'X-Test': '1',
            },
            cache: 'reload',
        });

        expect(request.method).toBe('GET');
        expect(request.mode).toBe('cors');
        expect(request.cache).toBe('reload');
        expect(request.headers.get('Accept')).toContain('image/webp');
        expect(request.headers.get('X-Test')).toBe('1');
    });

    it('createServiceWorkerRedirectResponse は shared と error query を付与する', () => {
        const response = createServiceWorkerRedirectResponse({
            path: '/ehagaki/',
            error: 'upload_failed',
            location: { origin: 'https://example.com' } as Location,
        });

        expect(response.status).toBe(303);
        expect(response.headers.get('Location')).toBe(
            'https://example.com/ehagaki/?shared=true&error=upload_failed',
        );
    });

    it('extractSharedMediaFromFormData は空ファイルや文字列を除外する', async () => {
        const formData = new FormData();
        formData.append('media', 'text-entry');
        formData.append('media', new File([], 'empty.png', { type: 'image/png' }));
        formData.append('media', new File(['abc'], 'photo.png', { type: 'image/png' }));

        const result = await extractSharedMediaFromFormData(
            formData,
            () => '2026-05-05T00:00:00.000Z',
        );

        expect(result).toEqual({
            images: [expect.any(File)],
            metadata: [
                {
                    name: 'photo.png',
                    type: 'image/png',
                    size: 3,
                    timestamp: '2026-05-05T00:00:00.000Z',
                },
            ],
        });
    });
});