import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHostOwnedUploadExecutor } from '../../lib/hostOwnedUpload';
import { replacePlaceholdersInGallery, replacePlaceholdersWithResults } from '../../lib/editor/placeholderManager';
import { mediaGalleryStore } from '../../stores/mediaGalleryStore.svelte';
import { mockImageCompressionCanvas } from '../imageCompressionCanvasMock';
import { MockStorage } from '../helpers';
import type { UploadHelperDependencies, FileUploadResponse } from '../../lib/types';

vi.mock('../../lib/mimeTypeSupport', () => ({ MimeTypeSupport: class { canEncodeMimeType() { return true; } } }));

vi.mock('../../lib/utils/fileUtils', async importOriginal => ({
    ...await importOriginal<typeof import('../../lib/utils/fileUtils')>(),
    getImageDimensions: vi.fn(async () => ({ width: 1024, height: 3603, displayWidth: 100, displayHeight: 350 })),
}));

describe('Host-owned compressed image placement', () => {
    beforeEach(() => { mockImageCompressionCanvas(); });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

    async function prepare() {
        const original = new File([new Uint8Array(100000)], 'image.png', { type: 'image/png' });
        const skipped = new File([new Uint8Array(10000)], 'image.png', { type: 'image/png' });
        const uploadMedia = vi.fn(async (file: File) => ({ url: `https://host.example/${file.type === 'image/webp' ? 'first.webp' : 'second.png'}` }));
        const executor = createHostOwnedUploadExecutor({ uploadMedia, signal: new AbortController().signal });
        const storage = new MockStorage(); storage.setItem('imageQualityLevel', 'medium');
        const prepared = await executor.prepareFiles([original, skipped], {
            localStorage: storage, crypto: { digest: async () => new ArrayBuffer(32) },
        } as unknown as UploadHelperDependencies);
        const placeholders = prepared.map(({ file }, index) => ({ file, placeholderId: `placeholder-${index}` }));
        const results = await executor.uploadPreparedFiles(prepared.map(({ file }) => file), placeholders);
        expect(prepared[0].file.name).toBe('image.webp');
        expect(prepared[1].file).toBe(skipped);
        expect(results.map(result => result.sizeInfo?.originalFilename)).toEqual(['image.png', 'image.png']);
        expect(uploadMedia.mock.calls.map(([file]) => file)).toEqual(prepared.map(({ file }) => file));
        expect(results.map(result => result.placeholderId)).toEqual(['placeholder-0', 'placeholder-1']);
        return { placeholders, results };
    }

    it.each([false, true])('keeps gallery order with mixed compression (reversed results: %s)', async reverse => {
        const { placeholders, results } = await prepare();
        const update = vi.spyOn(mediaGalleryStore, 'updateItem');
        await replacePlaceholdersInGallery(reverse ? [...results].reverse() : results, placeholders, {}, {}, { update: vi.fn() }, async () => null, () => 'image/webp', false);
        expect(update).toHaveBeenCalledWith('placeholder-0', expect.objectContaining({ src: 'https://host.example/first.webp' }));
        expect(update).toHaveBeenCalledWith('placeholder-1', expect.objectContaining({ src: 'https://host.example/second.png' }));
    });

    it('keeps editor order with duplicate original names and renamed processed files', async () => {
        const { placeholders, results } = await prepare();
        const nodes = placeholders.map(({ placeholderId }) => ({ type: { name: 'image' }, attrs: { src: placeholderId, isPlaceholder: true }, nodeSize: 1 }));
        const updates = new Map<number, Record<string, unknown>>();
        const editor: any = {
            state: {
                doc: { descendants: (callback: (node: unknown, pos: number) => void) => nodes.forEach((node, pos) => callback(node, pos)) },
                tr: { setNodeMarkup: vi.fn((pos: number, _type: unknown, attrs: Record<string, unknown>) => { updates.set(pos, attrs); return {}; }) },
            },
            view: { dispatch: vi.fn() },
        };
        await replacePlaceholdersWithResults(results, placeholders, editor, {}, {}, { update: vi.fn() }, async () => null, false);
        expect(updates.get(0)?.src).toBe('https://host.example/first.webp');
        expect(updates.get(1)?.src).toBe('https://host.example/second.png');
    });

    it.each(['failed', 'aborted'] as const)('targets the identified placeholder for %s results', async outcome => {
        const { placeholders, results } = await prepare();
        const update = vi.spyOn(mediaGalleryStore, 'updateItem');
        const remove = vi.spyOn(mediaGalleryStore, 'removeItem');
        const failure: FileUploadResponse = { success: false, placeholderId: 'placeholder-1', ...(outcome === 'aborted' ? { aborted: true } : { error: 'upload failed' }) };
        await replacePlaceholdersInGallery([failure, results[0]], placeholders, {}, {}, { update: vi.fn() }, async () => null, () => 'image/webp', false);
        expect(remove).toHaveBeenCalledWith('placeholder-1');
        expect(update).toHaveBeenCalledWith('placeholder-0', expect.objectContaining({ src: 'https://host.example/first.webp' }));
    });
});
