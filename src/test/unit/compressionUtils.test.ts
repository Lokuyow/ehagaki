import { describe, expect, it, vi } from 'vitest';
import { checkAbort } from '../../lib/videoCompression/compressionUtils';

describe('video compression utils', () => {
    describe('checkAbort', () => {
        it('returns null when the injected abort checker is false', () => {
            const file = new File(['video'], 'movie.mp4', { type: 'video/mp4' });
            const onProgress = vi.fn();

            const result = checkAbort(file, 'test', onProgress, () => false);

            expect(result).toBeNull();
            expect(onProgress).not.toHaveBeenCalled();
        });

        it('returns an aborted result and resets progress when the injected abort checker is true', () => {
            const file = new File(['video'], 'movie.mp4', { type: 'video/mp4' });
            const onProgress = vi.fn();

            const result = checkAbort(file, 'test', onProgress, () => true);

            expect(result).toEqual({
                file,
                wasCompressed: false,
                wasSkipped: true,
                aborted: true
            });
            expect(onProgress).toHaveBeenCalledWith(0);
        });
    });
});
