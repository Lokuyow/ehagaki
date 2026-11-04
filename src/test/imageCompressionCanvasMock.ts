import { vi } from 'vitest';

/** Canvas boundary mock; real decoding/encoding is covered in browser tests. */
export function mockImageCompressionCanvas() {
    const state = { width: 2000, height: 7038, failDecode: false, pendingDecode: false, outputSize: 1000, nativeMime: '', failNative: false };
    const images: any[] = [];
    const canvases: any[] = [];
    class MockImage {
        naturalWidth = state.width;
        naturalHeight = state.height;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor() { images.push(this); }
        set src(value: string) { if (value && !state.pendingDecode) queueMicrotask(() => state.failDecode ? this.onerror?.() : this.onload?.()); }
    }
    vi.stubGlobal('Image', MockImage);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:image-test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const createElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string, ...args: any[]) => {
        if (tag !== 'canvas') return (createElement as any)(tag, ...args);
        const context = { drawImage: vi.fn(), getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 })), fillRect: vi.fn(), fillStyle: '', globalCompositeOperation: '' };
        const canvas = { width: 0, height: 0, context, getContext: vi.fn(() => context),
            toBlob: vi.fn((cb: BlobCallback, mime: string) => cb(state.failNative ? null : new Blob([new Uint8Array(state.outputSize)], { type: state.nativeMime || mime }))) };
        canvases.push(canvas);
        return canvas;
    }) as typeof document.createElement);
    return { state, images, canvases };
}
