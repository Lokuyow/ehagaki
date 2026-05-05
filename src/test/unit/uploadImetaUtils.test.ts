import { describe, expect, it, vi } from 'vitest';

import { generateDevImetaTags } from '../../lib/uploadImetaUtils';

describe('uploadImetaUtils', () => {
    it('editor/server blurhash をマージして imeta tags を生成し、x がなければ補完する', async () => {
        const imageXMap: Record<string, string> = {
            'https://example.com/server.jpg': 'server-x',
        };
        const createImetaTag = vi.fn(async ({ url, m, blurhash, ox, x }) => [
            'imeta',
            `url ${url}`,
            `m ${m}`,
            blurhash ? `blurhash ${blurhash}` : '',
            ox ? `ox ${ox}` : '',
            x ? `x ${x}` : '',
        ].filter(Boolean));

        const result = await generateDevImetaTags({
            editor: {} as any,
            imageServerBlurhashMap: {
                'https://example.com/server.jpg': 'server-blurhash',
            },
            imageOxMap: {
                'https://example.com/editor.jpg': 'editor-ox',
            },
            imageXMap,
            dependencies: {
                extractImageBlurhashMap: vi.fn(() => ({
                    'https://example.com/editor.jpg': 'editor-blurhash',
                })),
                calculateImageHash: vi.fn(async (url: string) =>
                    url.includes('editor') ? 'editor-x' : null,
                ),
                getMimeTypeFromUrl: vi.fn((url: string) =>
                    url.endsWith('.jpg') ? 'image/jpeg' : 'application/octet-stream',
                ),
                createImetaTag,
            },
        });

        expect(result).toEqual([
            'imeta url https://example.com/editor.jpg m image/jpeg blurhash editor-blurhash ox editor-ox x editor-x',
            'imeta url https://example.com/server.jpg m image/jpeg blurhash server-blurhash x server-x',
        ]);
        expect(imageXMap).toEqual({
            'https://example.com/server.jpg': 'server-x',
            'https://example.com/editor.jpg': 'editor-x',
        });
        expect(createImetaTag).toHaveBeenNthCalledWith(1, {
            url: 'https://example.com/editor.jpg',
            m: 'image/jpeg',
            blurhash: 'editor-blurhash',
            ox: 'editor-ox',
            x: 'editor-x',
        });
    });

    it('既に x がある URL では calculateImageHash を呼ばない', async () => {
        const calculateImageHash = vi.fn(async () => 'unused-x');

        await generateDevImetaTags({
            editor: {} as any,
            imageServerBlurhashMap: {
                'https://example.com/server.jpg': 'server-blurhash',
            },
            imageOxMap: {},
            imageXMap: {
                'https://example.com/server.jpg': 'server-x',
            },
            dependencies: {
                extractImageBlurhashMap: vi.fn(() => ({})),
                calculateImageHash,
                getMimeTypeFromUrl: vi.fn(() => 'image/jpeg'),
                createImetaTag: vi.fn(async () => ['imeta-tag']),
            },
        });

        expect(calculateImageHash).not.toHaveBeenCalled();
    });
});