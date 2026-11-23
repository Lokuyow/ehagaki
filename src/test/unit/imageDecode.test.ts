import { afterEach, describe, expect, it, vi } from 'vitest';
import { waitForImageDecode } from '../../lib/utils/imageDecode';

const image = (decode?: () => Promise<void>) => ({ decode }) as unknown as HTMLImageElement;

describe('waitForImageDecode', () => {
    afterEach(() => { vi.useRealTimers(); });

    it('resolves after a successful decode', async () => {
        const decode = vi.fn(() => Promise.resolve());
        await expect(waitForImageDecode(image(decode))).resolves.toBeUndefined();
        expect(decode).toHaveBeenCalledOnce();
    });

    it('treats a rejected decode as a fall-through to drawImage', async () => {
        await expect(waitForImageDecode(image(() => Promise.reject(new Error('EncodingError'))))).resolves.toBeUndefined();
    });

    it('stops waiting when decode never settles', async () => {
        vi.useFakeTimers();
        let settled = false;
        const wait = waitForImageDecode(image(() => new Promise<void>(() => {})), 100).then(() => { settled = true; });
        await vi.advanceTimersByTimeAsync(99);
        expect(settled).toBe(false);
        await vi.advanceTimersByTimeAsync(1);
        await wait;
        expect(settled).toBe(true);
    });

    it('resolves immediately without the decode API', async () => {
        await expect(waitForImageDecode(image())).resolves.toBeUndefined();
    });
});
