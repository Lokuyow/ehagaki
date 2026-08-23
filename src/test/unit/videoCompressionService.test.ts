import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
    instances: 0,
    constructorError: false,
    compressError: false,
    compressCalls: [] as Array<{ file: File; options: unknown }>,
    progressCallbacks: [] as Array<((progress: number) => void) | undefined>,
    abortCalls: 0,
    cleanupCalls: 0,
}));

vi.mock('../../lib/videoCompression/mediabunnyCompression', () => ({
    MediaBunnyCompression: class {
        constructor() {
            state.instances += 1;
            if (state.constructorError) throw new Error('MediaBunny module initialization failed');
        }

        setProgressCallback(callback?: (progress: number) => void): void {
            state.progressCallbacks.push(callback);
        }

        abort(): void {
            state.abortCalls += 1;
        }

        async cleanup(): Promise<void> {
            state.cleanupCalls += 1;
        }

        async compress(file: File, options: unknown) {
            state.compressCalls.push({ file, options });
            if (state.compressError) throw new Error('MediaBunny compression failed');
            return { file, wasCompressed: true };
        }
    },
}));

import { VideoCompressionService } from '../../lib/videoCompression/videoCompressionService';
import {
    MIN_VIDEO_COMPRESSION_FILE_SIZE_BYTES,
    VIDEO_COMPRESSION_OPTIONS_MAP,
} from '../../lib/videoCompression/videoCompressionConfig';

class TestStorage implements Storage {
    private readonly values = new Map<string, string>();
    get length(): number { return this.values.size; }
    clear(): void { this.values.clear(); }
    getItem(key: string): string | null { return this.values.get(key) ?? null; }
    key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
    removeItem(key: string): void { this.values.delete(key); }
    setItem(key: string, value: string): void { this.values.set(key, value); }
}

function videoFile(size = MIN_VIDEO_COMPRESSION_FILE_SIZE_BYTES + 1): File {
    return new File([new Uint8Array(size)], 'clip.mp4', { type: 'video/mp4' });
}

describe('VideoCompressionService', () => {
    beforeEach(() => {
        Object.assign(state, {
            instances: 0,
            constructorError: false,
            compressError: false,
            compressCalls: [],
            progressCallbacks: [],
            abortCalls: 0,
            cleanupCalls: 0,
        });
    });

    it('returns a non-video file without loading the adapter', async () => {
        const file = new File(['text'], 'note.txt', { type: 'text/plain' });
        const result = await new VideoCompressionService(new TestStorage()).compress(file);

        expect(result).toEqual({ file, wasCompressed: false });
        expect(state.instances).toBe(0);
    });

    it('skips videos at or below the minimum size without loading the adapter', async () => {
        const file = videoFile(MIN_VIDEO_COMPRESSION_FILE_SIZE_BYTES);
        const result = await new VideoCompressionService(new TestStorage()).compress(file);

        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
        expect(state.instances).toBe(0);
    });

    it('skips disabled compression without loading the adapter', async () => {
        const storage = new TestStorage();
        storage.setItem('videoQualityLevel', 'none');
        const file = videoFile();

        const result = await new VideoCompressionService(storage).compress(file);

        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
        expect(state.instances).toBe(0);
    });

    it('passes the typed active configuration to the lazy adapter', async () => {
        const storage = new TestStorage();
        storage.setItem('videoQualityLevel', 'low');
        const file = videoFile();

        await new VideoCompressionService(storage).compress(file);

        expect(state.compressCalls).toEqual([{ file, options: VIDEO_COMPRESSION_OPTIONS_MAP.low }]);
    });

    it('keeps the original file when adapter initialization fails', async () => {
        state.constructorError = true;
        const file = videoFile();

        const result = await new VideoCompressionService(new TestStorage()).compress(file);

        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
    });

    it('keeps the original file when adapter compression fails', async () => {
        state.compressError = true;
        const file = videoFile();

        const result = await new VideoCompressionService(new TestStorage()).compress(file);

        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
    });

    it('returns the abort contract before loading the adapter and resets progress', async () => {
        const onProgress = vi.fn();
        const file = videoFile();
        const service = new VideoCompressionService(new TestStorage(), () => true);
        service.setProgressCallback(onProgress);

        const result = await service.compress(file);

        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true, aborted: true });
        expect(onProgress).toHaveBeenCalledWith(0);
        expect(state.instances).toBe(0);
    });

    it('forwards progress, abort, cleanup, and reuses one lazy adapter instance', async () => {
        const onProgress = vi.fn();
        const service = new VideoCompressionService(new TestStorage());
        service.setProgressCallback(onProgress);

        await service.compress(videoFile());
        await service.compress(videoFile());
        service.abort();
        await service.cleanup();

        expect(state.instances).toBe(1);
        expect(state.progressCallbacks).toEqual([onProgress]);
        expect(onProgress).toHaveBeenCalledWith(0);
        expect(state.abortCalls).toBe(1);
        expect(state.cleanupCalls).toBe(1);
    });
});
