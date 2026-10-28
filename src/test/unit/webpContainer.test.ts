import { describe, it, expect } from 'vitest';
import { File as NodeFile } from 'node:buffer';
import { inspectWebp } from '../../lib/utils/webpContainer';
import { ImageCompressionService } from '../../lib/imageCompressionService';
import { ReactionImageCompressionService, validateReactionImage } from '../../lib/upload/reactionImageCompression';
import { createWebpFixture, createStaticWebpFixture } from '../webpFixture';
import { MockStorage } from '../helpers';
const file = (bytes = createWebpFixture()) => new NodeFile([bytes], 'animation.webp', { type: 'image/webp', lastModified: 1234 }) as unknown as File;
describe('animated WebP containers', () => {
    it('recognizes animation, including unknown padded chunks', async () => {
        expect(await inspectWebp(file())).toBe('animated');
        expect(await validateReactionImage(file())).toBe('animated');
    });
    it.each(['none', 'low', 'medium', 'high'])('preserves the original at %s quality', async level => {
        const storage = new MockStorage(); storage.setItem('imageQualityLevel', level);
        const input = file();
        const service = new ImageCompressionService({ canEncodeMimeType: () => true, canEncodeWebpWithQuality: async () => true }, storage, () => false);
        const result = await service.compress(input);
        expect(result).toEqual({ file: input, wasCompressed: false, wasSkipped: true });
        expect(result.file).toBe(input);
        expect(new Uint8Array(await result.file.arrayBuffer())).toEqual(createWebpFixture());
    });
    it('rejects inconsistent length, animation flags and truncated chunks', async () => {
        const wrongLength = createWebpFixture(); wrongLength[4] = 0;
        const wrongFlag = createWebpFixture(); wrongFlag[20] = 0;
        for (const bytes of [wrongLength, wrongFlag, createWebpFixture().slice(0, 30)]) {
            expect(await inspectWebp(file(bytes))).toBe('invalid');
            await expect(validateReactionImage(file(bytes))).rejects.toThrow('reactionUnsupportedImage');
        }
    });
    it('recognizes static WebP and cancels an outstanding read', async () => {
        expect(await inspectWebp(file(createStaticWebpFixture()))).toBe('static');
        const controller = new AbortController();
        const pending = inspectWebp({ size: 100, slice: () => ({ arrayBuffer: () => new Promise<ArrayBuffer>(() => {}) }) } as unknown as Blob, controller.signal);
        controller.abort();
        await expect(pending).rejects.toThrow();
    });
    it('honors cancellation before reading', async () => {
        const controller = new AbortController(); controller.abort();
        await expect(inspectWebp(file(), controller.signal)).rejects.toThrow();
        const service = new ReactionImageCompressionService({ signal: controller.signal, abort: () => controller.abort() });
        expect(await service.compress(file())).toMatchObject({ aborted: true });
    });
});
