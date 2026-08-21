import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
    canDecodeVideo: true,
    canEncodeVideo: true,
    canDecodeAudio: true,
    nativeAac: true,
    customAac: false,
    preserveAudio: true,
    failConversion: false,
    audioOptions: [] as any[],
    registeredAacEncoder: 0,
}));

vi.mock('mediabunny', () => {
    class Input {
        source: { blob: File };
        constructor({ source }: any) { this.source = source; }
        async getVideoTracks() { return [{ codec: 'avc', displayWidth: 1280, displayHeight: 720 }]; }
        async getAudioTracks() {
            return this.source.blob.name.includes('_compressed')
                ? (state.preserveAudio ? [{ codec: 'aac', numberOfChannels: 2, sampleRate: 44100 }] : [])
                : [{ codec: 'aac', numberOfChannels: 2, sampleRate: 44100 }];
        }
        dispose() { }
    }
    class BlobSource { constructor(public blob: File) { } }
    class BufferTarget { buffer: ArrayBuffer | null = null; }
    class Output { constructor(public options: { target: BufferTarget }) { } }
    class Mp4OutputFormat { }
    return {
        ALL_FORMATS: [], BlobSource, BufferTarget, Input, Output, Mp4OutputFormat,
        QUALITY_HIGH: { factor: 2 }, QUALITY_MEDIUM: { factor: 1 }, QUALITY_VERY_LOW: { factor: 0.3 },
        canDecodeVideo: vi.fn(async () => state.canDecodeVideo),
        canEncodeVideo: vi.fn(async () => state.canEncodeVideo),
        canDecodeAudio: vi.fn(async () => state.canDecodeAudio),
        canEncodeAudio: vi.fn(async () => state.nativeAac || state.customAac),
        Conversion: {
            init: vi.fn(async (options: any) => {
                state.audioOptions.push(await options.audio({ codec: 'aac', numberOfChannels: 2, sampleRate: 44100 }));
                const conversion: any = {
                    isValid: true,
                    discardedTracks: state.preserveAudio ? [] : [{ track: { isVideoTrack: () => false, isAudioTrack: () => true } }],
                    onProgress: undefined as ((progress: number) => void) | undefined,
                    execute: async () => {
                        if (state.failConversion) throw new Error('conversion failed');
                        options.output.options.target.buffer = new ArrayBuffer(64);
                        conversion.onProgress?.(1);
                    },
                    cancel: async () => { },
                };
                return conversion;
            }),
        },
    };
});

vi.mock('@mediabunny/aac-encoder', () => ({
    registerAacEncoder: vi.fn(() => {
        state.registeredAacEncoder += 1;
        state.customAac = true;
    }),
}));

import { MediaBunnyCompression } from '../../lib/videoCompression/mediabunnyCompression';

function videoFile(): File {
    return new File([new Uint8Array(300 * 1024)], 'clip.mp4', { type: 'video/mp4' });
}

const options = {
    maxSize: 640,
    audioBitrate: '64k',
    audioSampleRate: 44100,
    audioChannels: 2,
    mediabunnyVideoQualityFactor: 1,
    mediabunnyAudioQualityFactor: 1,
};

describe('MediaBunnyCompression', () => {
    beforeEach(() => {
        Object.assign(state, {
            canDecodeVideo: true,
            canEncodeVideo: true,
            canDecodeAudio: true,
            nativeAac: true,
            customAac: false,
            preserveAudio: true,
            failConversion: false,
            audioOptions: [],
            registeredAacEncoder: 0,
        });
    });

    it('skips compression when video decode or AVC encode is unavailable', async () => {
        state.canDecodeVideo = false;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        expect(result).toMatchObject({ wasCompressed: false, wasSkipped: true });
    });

    it('uses native AAC encoding without loading the optional encoder', async () => {
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        expect(result.wasCompressed).toBe(true);
        expect(state.registeredAacEncoder).toBe(0);
        expect(state.audioOptions).toEqual([expect.objectContaining({ codec: 'aac', forceTranscode: true })]);
    });

    it('registers the optional AAC encoder only when native AAC encoding is unavailable', async () => {
        state.nativeAac = false;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        expect(result.wasCompressed).toBe(true);
        expect(state.registeredAacEncoder).toBe(1);
    });

    it('packet-copies audio when it cannot be decoded for AAC transcoding', async () => {
        state.canDecodeAudio = false;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        expect(result.wasCompressed).toBe(true);
        expect(state.audioOptions).toEqual([{}]);
    });

    it('keeps the original file when MediaBunny would discard input audio', async () => {
        state.preserveAudio = false;
        const file = videoFile();
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(file, options);
        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
    });

    it('keeps the original file when conversion fails', async () => {
        state.failConversion = true;
        const file = videoFile();
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(file, options);
        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
    });

    it('keeps the aborted result contract', async () => {
        const file = videoFile();
        const result = await new MediaBunnyCompression(() => 64_000, () => true).compressWithMediabunny(file, options);
        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true, aborted: true });
    });
});
