import { describe, expect, it, vi } from 'vitest';
import {
    encodeWebpInWorker,
    type ImageWebpEncodeWorker,
} from '../../lib/imageWebpWorkerEncoder';

function createWorker() {
    const worker = {
        postMessage: vi.fn(),
        terminate: vi.fn(),
        onmessage: null,
        onerror: null,
        onmessageerror: null,
    } as unknown as ImageWebpEncodeWorker & {
        postMessage: ReturnType<typeof vi.fn>;
        terminate: ReturnType<typeof vi.fn>;
    };
    return worker;
}

const pixels = () => ({ data: new Uint8ClampedArray(8), width: 2, height: 1 }) as ImageData;

describe('encodeWebpInWorker', () => {
    it('transfers the pixels and resolves with the encoded bytes', async () => {
        const worker = createWorker();
        const imageData = pixels();
        const buffer = imageData.data.buffer;
        const promise = encodeWebpInWorker(() => worker, imageData, 80);

        expect(worker.postMessage).toHaveBeenCalledExactlyOnceWith(
            { type: 'encode', pixels: buffer, width: 2, height: 1, quality: 80 },
            [buffer],
        );
        const bytes = new Uint8Array([1, 2, 3]).buffer;
        worker.onmessage?.({ data: { type: 'complete', bytes } } as MessageEvent);

        await expect(promise).resolves.toBe(bytes);
        expect(worker.terminate).toHaveBeenCalledOnce();
        expect(worker.onmessage).toBeNull();
        expect(worker.onerror).toBeNull();
    });

    it('rejects and terminates when the worker reports an encode error', async () => {
        const worker = createWorker();
        const promise = encodeWebpInWorker(() => worker, pixels(), 80);
        worker.onmessage?.({ data: { type: 'error', message: 'Encoding error.' } } as MessageEvent);

        await expect(promise).rejects.toThrow('Encoding error.');
        expect(worker.terminate).toHaveBeenCalledOnce();
    });

    it('rejects when the worker script fails to load', async () => {
        const worker = createWorker();
        const promise = encodeWebpInWorker(() => worker, pixels(), 80);
        worker.onerror?.({ preventDefault: vi.fn() } as unknown as ErrorEvent);

        await expect(promise).rejects.toThrow('image_webp_encode_worker_unavailable');
        expect(worker.terminate).toHaveBeenCalledOnce();
    });

    it('rejects when the worker cannot be constructed', async () => {
        const failure = new Error('SecurityError');
        await expect(encodeWebpInWorker(() => { throw failure; }, pixels(), 80)).rejects.toBe(failure);
    });

    it('terminates the worker and rejects with AbortError on abort', async () => {
        const worker = createWorker();
        const controller = new AbortController();
        const promise = encodeWebpInWorker(() => worker, pixels(), 80, controller.signal);
        controller.abort();

        await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
        expect(worker.terminate).toHaveBeenCalledOnce();
    });

    it('does not start a worker for an already aborted signal', async () => {
        const factory = vi.fn(createWorker);
        const controller = new AbortController();
        controller.abort();

        await expect(encodeWebpInWorker(factory, pixels(), 80, controller.signal))
            .rejects.toMatchObject({ name: 'AbortError' });
        expect(factory).not.toHaveBeenCalled();
    });
});
