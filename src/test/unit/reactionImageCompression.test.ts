import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getReactionResizeDimensions, ReactionImageCompressionService, validateReactionImage } from '../../lib/upload/reactionImageCompression';
import { FileUploadManager } from '../../lib/fileUploadManager';
import { Blob as NodeBlob, File as NodeFile } from 'node:buffer';
import { createGifFixture } from '../gifFixture';
const { encode, transport } = vi.hoisted(() => ({ encode: vi.fn(), transport: vi.fn() }));
vi.mock('@jsquash/webp/encode', () => ({ default: encode }));
vi.mock('../../lib/upload/uploadAdapterRegistry', () => ({ getUploadAdapter: () => ({ upload: transport }) }));
let width = 512; let height = 512;
const png = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg=='), c => c.charCodeAt(0));
function webp(type = 'VP8L') {
    const bytes = new Uint8Array(22); bytes.set(new TextEncoder().encode('RIFF')); new DataView(bytes.buffer).setUint32(4, 14, true);
    bytes.set(new TextEncoder().encode('WEBP' + type), 8); new DataView(bytes.buffer).setUint32(16, 1, true); return bytes;
}
function fileWithBytes(bytes: Uint8Array<ArrayBuffer>, type: string) {
    const file = new File([bytes], 'image', { type });
    Object.defineProperty(file, 'arrayBuffer', { value: async () => bytes.slice().buffer });
    return file;
}
const imageFile = (type = 'image/jpeg') => fileWithBytes(type === 'image/png' ? png : type === 'image/webp' ? webp() : new Uint8Array([255, 216, 255, 0, 255, 217]), type);
function setup() {
    const controller = new AbortController(); const service = new ReactionImageCompressionService({ signal: controller.signal, abort: () => controller.abort() });
    const progress = vi.fn(); service.setProgressCallback(progress); return { controller, service, progress };
}
beforeEach(() => {
    width = 512; height = 512; vi.clearAllMocks();
    vi.stubGlobal('File', NodeFile);
    vi.stubGlobal('Blob', NodeBlob);
    vi.stubGlobal('Image', class {
        naturalWidth = width; naturalHeight = height; onload?: () => void; onerror?: () => void;
        set src(value: string) { if (value) queueMicrotask(() => this.onload?.()); }
    });
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fixture'); vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const original = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((name, options) => {
        const element = original(name, options);
        if (name === 'canvas') {
            const canvas = element as HTMLCanvasElement;
            vi.spyOn(canvas, 'getContext').mockReturnValue({ drawImage: vi.fn(), getImageData: () => ({ data: new Uint8ClampedArray(canvas.width * canvas.height * 4), width: canvas.width, height: canvas.height }) } as unknown as CanvasRenderingContext2D);
            vi.spyOn(canvas, 'toBlob').mockImplementation((callback, type) => callback(new Blob([
                type === 'image/png' ? png : new Uint8Array([255, 216, 255, ...new Array(40).fill(0), 255, 217]),
            ], { type })));
        }
        return element;
    });
    encode.mockResolvedValue(webp().buffer); transport.mockResolvedValue({ success: true, url: 'https://upload.example/image.jpg' });
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('Reaction image transformation', () => {
    it.each([[512, 512, 128, 128], [256, 512, 128, 256], [512, 256, 256, 128], [64, 64, 64, 64], [100, 500, 100, 500]])('short edge %sx%s becomes %sx%s', (w, h, tw, th) => {
        expect(getReactionResizeDimensions(w, h)).toEqual({ width: tw, height: th });
    });
    it('uses JPEG quality 100 even for tiny input and retains larger resized output', async () => {
        const f = setup(); const file = imageFile(); const result = await f.service.compress(file);
        expect(result.wasCompressed).toBe(true); expect(result.file.size).toBeGreaterThan(file.size);
        const canvas = vi.mocked(document.createElement).mock.results.find(result => result.value instanceof HTMLCanvasElement)!.value as HTMLCanvasElement;
        expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 1);
        expect([canvas.width, canvas.height]).toEqual([128, 128]); expect(f.progress).toHaveBeenLastCalledWith(100);
    });
    it('explicitly passes lossless:1 and all quality options to the WebP encoder', async () => {
        const f = setup(); expect((await f.service.compress(imageFile('image/webp'))).file.type).toBe('image/webp');
        expect(encode).toHaveBeenCalledWith(expect.objectContaining({ width: 128, height: 128 }), { lossless: 1, quality: 100, near_lossless: 100, alpha_quality: 100 });
    });
    it('preserves PNG format and alpha-capable encoding', async () => {
        const result = await setup().service.compress(imageFile('image/png')); expect(result.file.type).toBe('image/png');
    });
    it('does not upscale or reencode small images', async () => {
        width = 100; height = 500; const file = imageFile();
        expect(await setup().service.compress(file)).toMatchObject({ file, wasCompressed: false, wasSkipped: true });
        expect(encode).not.toHaveBeenCalled();
    });
    it.each(['image/svg+xml', 'image/avif', 'image/heic', 'video/mp4'])('rejects %s before transport', async type => {
        await expect(validateReactionImage(new File(['x'], 'image', { type }))).rejects.toThrow('reactionUnsupportedImage');
    });
    it('rejects APNG and animated WebP containers', async () => {
        const animatedPng = new Uint8Array(png.length + 12); animatedPng.set(png.subarray(0, 33)); animatedPng.set(new TextEncoder().encode('acTL'), 37); animatedPng.set(png.subarray(33), 45);
        await expect(validateReactionImage(fileWithBytes(animatedPng, 'image/png'))).rejects.toThrow('reactionUnsupportedImage');
        await expect(validateReactionImage(fileWithBytes(webp('ANIM'), 'image/webp'))).rejects.toThrow('reactionUnsupportedImage');
    });
    it.each(['87a', '89a'] as const)('preserves GIF%s bytes, name and dimensions without a canvas', async version => {
        for (const large of [false, true]) for (const animated of version === '87a' ? [false] : [false, true]) {
            const bytes = createGifFixture({ version, large, animated });
            const file = new File([bytes], 'reaction.gif', { type: 'image/gif', lastModified: 1234 });
            const f = setup(); const result = await f.service.compress(file);
            expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
            expect(result.file).toBe(file);
            expect(new Uint8Array(await result.file.arrayBuffer())).toEqual(bytes);
            expect(result.file.name).toBe('reaction.gif'); expect(result.file.lastModified).toBe(1234);
            expect(f.progress).toHaveBeenLastCalledWith(100);
        }
        expect(document.createElement).not.toHaveBeenCalledWith('canvas');
        expect(encode).not.toHaveBeenCalled(); expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
    it('rejects invalid GIF headers and zero dimensions before transport', async () => {
        const zeroWidth = createGifFixture(); zeroWidth[6] = 0; zeroWidth[7] = 0;
        const zeroHeight = createGifFixture(); zeroHeight[8] = 0; zeroHeight[9] = 0;
        const wrongVersion = createGifFixture(); wrongVersion[4] = 56;
        for (const bytes of [new Uint8Array(0), new TextEncoder().encode('GIF89a'), png, zeroWidth, zeroHeight, wrongVersion]) {
            await expect(setup().service.compress(fileWithBytes(bytes, 'image/gif'))).rejects.toThrow('reactionUnsupportedImage');
        }
        expect(URL.createObjectURL).not.toHaveBeenCalled(); expect(transport).not.toHaveBeenCalled();
    });
    it('rejects a GIF the browser cannot load and releases its object URL', async () => {
        vi.stubGlobal('Image', class {
            onload?: () => void; onerror?: () => void;
            set src(value: string) { if (value) queueMicrotask(() => this.onerror?.()); }
        });
        await expect(setup().service.compress(fileWithBytes(createGifFixture(), 'image/gif'))).rejects.toThrow('reactionImageTransformFailed');
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:fixture');
    });
    it('cancels a pending GIF decode without uploading or reporting completion', async () => {
        vi.stubGlobal('Image', class { set src(_value: string) {} });
        const f = setup(); const pending = f.service.compress(fileWithBytes(createGifFixture(), 'image/gif'));
        await vi.waitFor(() => expect(URL.createObjectURL).toHaveBeenCalled());
        f.service.abort();
        expect(await pending).toMatchObject({ aborted: true, wasCompressed: false });
        expect(f.progress).not.toHaveBeenCalledWith(100); expect(transport).not.toHaveBeenCalled();
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:fixture');
    });
    it('aborts encoding without completion progress or fallback', async () => {
        encode.mockReturnValue(new Promise(() => {})); const f = setup(); const pending = f.service.compress(imageFile('image/webp'));
        await vi.waitFor(() => expect(encode).toHaveBeenCalled()); f.service.abort();
        expect(await pending).toMatchObject({ aborted: true, wasCompressed: false }); expect(f.progress).not.toHaveBeenCalledWith(100);
    });
    it('fails on encoder output format mismatch without uploading the original', async () => {
        encode.mockResolvedValue(png.buffer);
        await expect(setup().service.compress(imageFile('image/webp'))).rejects.toThrow('reactionImageTransformFailed');
    });
    it.each([128, 127])('preserves exact input bytes at a %spx short edge', async shortEdge => {
        width = shortEdge; height = 1000; const file = imageFile('image/png');
        const result = await setup().service.compress(file);
        expect(result.file).toBe(file); expect(result.wasSkipped).toBe(true);
    });
    it('propagates an encoder failure and clears the registered callback through the manager', async () => {
        encode.mockRejectedValue(new Error('WASM failed'));
        const f = setup(); const callback = vi.spyOn(f.service, 'setProgressCallback');
        const manager = new FileUploadManager({ localStorage, fetch, crypto: crypto.subtle }, undefined, f.service);
        const result = await manager.uploadFileWithCallbacks(imageFile('image/webp'), undefined, { onImageCompressionProgress: f.progress });
        expect(result).toMatchObject({ success: false, errorCode: 'reactionImageTransformFailed' });
        expect(transport).not.toHaveBeenCalled(); expect(callback).toHaveBeenLastCalledWith(undefined);
        expect(f.progress).not.toHaveBeenCalledWith(100);
    });
    it('satisfies the actual manager runtime/progress contract and clears callbacks after an error', async () => {
        const f = setup(); const callback = vi.spyOn(f.service, 'setProgressCallback'); const progress = vi.fn();
        const manager = new FileUploadManager({ localStorage, fetch, crypto: crypto.subtle, document, window, navigator, setImageSizeInfoFromFileSize: vi.fn() }, undefined, f.service);
        expect(f.service.hasCompressionSettings()).toBe(true);
        expect(await manager.uploadFileWithCallbacks(imageFile(), undefined, { onImageCompressionProgress: progress })).toMatchObject({ success: true });
        expect(progress).toHaveBeenLastCalledWith(100); expect(callback).toHaveBeenLastCalledWith(undefined);
        expect(transport.mock.calls[0][0].file.size).toBeGreaterThan(imageFile().size);
        expect(await manager.uploadFileWithCallbacks(new File(['x'], 'bad.gif', { type: 'image/gif' }), undefined, { onImageCompressionProgress: progress })).toMatchObject({ success: false, errorCode: 'reactionUnsupportedImage' });
        expect(callback).toHaveBeenLastCalledWith(undefined);
    });
});
