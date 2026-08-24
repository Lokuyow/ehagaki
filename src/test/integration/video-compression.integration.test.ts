import { File as NodeFile } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import { VideoCompressionService } from '../../lib/videoCompression/videoCompressionService';
import { MIN_VIDEO_COMPRESSION_FILE_SIZE_BYTES } from '../../lib/videoCompression/videoCompressionConfig';

class TestStorage implements Storage {
    private readonly values = new Map<string, string>();
    get length(): number { return this.values.size; }
    clear(): void { this.values.clear(); }
    getItem(key: string): string | null { return this.values.get(key) ?? null; }
    key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
    removeItem(key: string): void { this.values.delete(key); }
    setItem(key: string, value: string): void { this.values.set(key, value); }
}

function unsupportedVideo(): File {
    return new NodeFile(
        [new Uint8Array(MIN_VIDEO_COMPRESSION_FILE_SIZE_BYTES + 1)],
        'unsupported.mp4',
        { type: 'video/mp4' },
    ) as unknown as File;
}

describe('video compression integration', () => {
    it('keeps an unsupported MediaBunny input as the original file', async () => {
        const file = unsupportedVideo();
        const result = await new VideoCompressionService(new TestStorage()).compress(file);

        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
    });

    it('preserves the disabled-setting boundary before MediaBunny is loaded', async () => {
        const storage = new TestStorage();
        storage.setItem('videoQualityLevel', 'none');
        const file = unsupportedVideo();

        const result = await new VideoCompressionService(storage).compress(file);

        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
    });
});
