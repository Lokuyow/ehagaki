import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
    videoTrackCanDecode: true,
    videoWidth: 1280,
    videoHeight: 720,
    canEncodeVideo: true,
    canEncodeVideoPredicate: null as ((options: any) => boolean) | null,
    videoCapabilityOptions: [] as any[],
    canDecodeAudio: true,
    nativeAac: true,
    customAac: false,
    outputAudioSampleRate: 44100,
    outputVideoPacketCount: 627,
    preserveAudio: true,
    failConversion: false,
    videoOptions: [] as any[],
    audioOptions: [] as any[],
    registeredAacEncoder: 0,
}));

vi.mock('mediabunny', () => {
    class Input {
        source: { blob: File };
        constructor({ source }: any) { this.source = source; }
        async getVideoTracks() {
            const isOutput = this.source.blob.name.includes('_compressed');
            const track = {
                canDecode: vi.fn(async () => state.videoTrackCanDecode),
                getCodec: vi.fn(async () => 'avc'),
                getDisplayWidth: vi.fn(async () => state.videoWidth),
                getDisplayHeight: vi.fn(async () => state.videoHeight),
                getDurationFromMetadata: vi.fn(async () => 1.5),
                computePacketStats: vi.fn(async () => ({
                    packetCount: isOutput ? state.outputVideoPacketCount : 627,
                    averagePacketRate: isOutput ? 29.8 : 30,
                    averageBitrate: isOutput ? 3_900_000 : 4_000_000,
                })),
                isVideoTrack: () => true,
            };
            return [track];
        }
        async getAudioTracks() {
            const isOutput = this.source.blob.name.includes('_compressed');
            const track = {
                codec: 'aac',
                numberOfChannels: 2,
                sampleRate: isOutput ? state.outputAudioSampleRate : 48000,
                getCodec: vi.fn(async () => 'aac'),
                getNumberOfChannels: vi.fn(async () => 2),
                getSampleRate: vi.fn(async () => isOutput ? state.outputAudioSampleRate : 48000),
                isAudioTrack: () => true,
            };
            return this.source.blob.name.includes('_compressed')
                ? (state.preserveAudio ? [track] : [])
                : [track];
        }
        async getDurationFromMetadata() { return 1.5; }
        dispose() { }
    }
    class BlobSource { constructor(public blob: File) { } }
    class BufferTarget { buffer: ArrayBuffer | null = null; }
    class Output { constructor(public options: { target: BufferTarget }) { } }
    class Mp4OutputFormat { }
    class Quality {
        constructor(public options: any) { }
    }
    return {
        ALL_FORMATS: [], BlobSource, BufferTarget, Input, Output, Mp4OutputFormat,
        Quality,
        QUALITY_HIGH: { factor: 2 }, QUALITY_MEDIUM: { factor: 1 }, QUALITY_VERY_LOW: { factor: 0.3 },
        canEncodeVideo: vi.fn(async (_codec: string, options: any) => {
            state.videoCapabilityOptions.push(options);
            return state.canEncodeVideoPredicate?.(options) ?? state.canEncodeVideo;
        }),
        canDecodeAudio: vi.fn(async () => state.canDecodeAudio),
        canEncodeAudio: vi.fn(async () => state.nativeAac || state.customAac),
        Conversion: {
            init: vi.fn(async (options: any) => {
                state.videoOptions.push(await options.video((await options.input.getVideoTracks())[0]));
                state.audioOptions.push(await options.audio({
                    codec: 'aac',
                    numberOfChannels: 2,
                    sampleRate: 44100,
                    getCodec: vi.fn(async () => 'aac'),
                    getNumberOfChannels: vi.fn(async () => 2),
                    getSampleRate: vi.fn(async () => 44100),
                    isAudioTrack: () => true,
                }));
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
import {
    clearMediaCompressionDiagnosticRecords,
    formatMediaCompressionDiagnostics,
    getMediaCompressionDiagnosticRecords,
    getRawVideoEncoderBenchmarkRecords,
} from '../../lib/videoCompression/mediaCompressionDiagnostics';

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
        window.history.replaceState({}, '', '/');
        clearMediaCompressionDiagnosticRecords();
        Object.assign(state, {
            videoTrackCanDecode: true,
            videoWidth: 1280,
            videoHeight: 720,
            canEncodeVideo: true,
            canEncodeVideoPredicate: null,
            videoCapabilityOptions: [],
            canDecodeAudio: true,
            nativeAac: true,
            customAac: false,
            outputAudioSampleRate: 44100,
            outputVideoPacketCount: 627,
            preserveAudio: true,
            failConversion: false,
            videoOptions: [],
            audioOptions: [],
            registeredAacEncoder: 0,
        });
    });

    it('skips compression when video decode or AVC encode is unavailable', async () => {
        state.videoTrackCanDecode = false;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        expect(result).toMatchObject({ wasCompressed: false, wasSkipped: true });
        expect(state.videoCapabilityOptions).toEqual([]);
        expect(state.videoOptions).toEqual([]);
    });

    it('uses the resized landscape dimensions for AVC capability checks', async () => {
        state.videoWidth = 3840;
        state.videoHeight = 2160;
        state.canEncodeVideoPredicate = ({ width, height }) => width <= 640 && height <= 360;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);

        expect(result.wasCompressed).toBe(true);
        expect(state.videoCapabilityOptions).toEqual([expect.objectContaining({ width: 640, height: 360 })]);
        expect(state.videoOptions[0]).toEqual(expect.objectContaining({ width: 640 }));
    });

    it('uses the resized portrait dimensions for AVC capability checks', async () => {
        state.videoWidth = 2160;
        state.videoHeight = 3840;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);

        expect(result.wasCompressed).toBe(true);
        expect(state.videoCapabilityOptions).toEqual([expect.objectContaining({ width: 360, height: 640 })]);
        expect(state.videoOptions[0]).toEqual(expect.objectContaining({ height: 640 }));
    });

    it('keeps the original dimensions when maxSize does not require resizing', async () => {
        state.videoWidth = 320;
        state.videoHeight = 240;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);

        expect(result.wasCompressed).toBe(true);
        expect(state.videoCapabilityOptions).toEqual([expect.objectContaining({ width: 320, height: 240 })]);
        expect(state.videoOptions[0]).toEqual(expect.objectContaining({ width: 320 }));
    });

    it('uses native AAC encoding without loading the optional encoder', async () => {
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        expect(result.wasCompressed).toBe(true);
        expect(state.registeredAacEncoder).toBe(0);
        expect(state.audioOptions).toEqual([expect.objectContaining({ codec: 'aac', forceTranscode: true })]);
    });

    it('does not enable forced packet copy when media-debug-audio is used without media-debug', async () => {
        window.history.replaceState({}, '', '/?media-debug-audio=copy');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);

        expect(result.wasCompressed).toBe(true);
        expect(state.audioOptions).toEqual([expect.objectContaining({ codec: 'aac', forceTranscode: true })]);
        expect(getMediaCompressionDiagnosticRecords()).toHaveLength(0);
    });

    it('does not enable realtime video latency when the realtime query is not fully gated', async () => {
        window.history.replaceState({}, '', '/?media-debug-video-latency=realtime');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);

        expect(result.wasCompressed).toBe(true);
        expect(getMediaCompressionDiagnosticRecords()).toHaveLength(0);
        expect(state.videoOptions[0]).not.toHaveProperty('latencyMode');
        expect(state.videoCapabilityOptions[0]).not.toHaveProperty('latencyMode');
    });

    it('keeps MediaBunny options and AAC loading unchanged when only the raw encoder benchmark is enabled', async () => {
        window.history.replaceState({}, '', '/?media-debug=1&media-debug-raw-video-encoder=1');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);

        expect(result.wasCompressed).toBe(true);
        expect(state.audioOptions).toEqual([expect.objectContaining({ codec: 'aac', forceTranscode: true })]);
        expect(state.videoOptions[0]).not.toHaveProperty('latencyMode');
        expect(state.videoCapabilityOptions[0]).not.toHaveProperty('latencyMode');
        expect(state.registeredAacEncoder).toBe(0);
        expect(getRawVideoEncoderBenchmarkRecords()).toHaveLength(0);
    });

    it('keeps MediaBunny options and AAC loading unchanged when the decode benchmark is enabled', async () => {
        window.history.replaceState({}, '', '/?media-debug=1&media-debug-video-decode-benchmark=1');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);

        expect(result.wasCompressed).toBe(true);
        expect(state.audioOptions).toEqual([expect.objectContaining({ codec: 'aac', forceTranscode: true })]);
        expect(state.videoOptions[0]).not.toHaveProperty('latencyMode');
        expect(state.videoCapabilityOptions[0]).not.toHaveProperty('latencyMode');
        expect(state.registeredAacEncoder).toBe(0);
        expect(getRawVideoEncoderBenchmarkRecords()).toHaveLength(0);
    });

    it('keeps subjective video Quality for every partial rate-control query', async () => {
        const searches = [
            '/',
            '/?media-debug=1',
            '/?media-debug-video-rate-control=bitrate',
            '/?media-debug=1&media-debug-video-rate-control=bitrate',
            '/?media-debug=1&media-debug-audio=copy',
        ];

        for (const search of searches) {
            clearMediaCompressionDiagnosticRecords();
            window.history.replaceState({}, '', search);
            state.videoCapabilityOptions = [];
            state.videoOptions = [];
            const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
            const record = getMediaCompressionDiagnosticRecords().at(-1);

            expect(result.wasCompressed).toBe(true);
            expect(state.videoOptions[0].quality).toEqual({ factor: 1 });
            expect(state.videoCapabilityOptions[0].quality).toBe(state.videoOptions[0].quality);
            expect(record?.videoRateControlMode).toBe(search.includes('media-debug=1') ? 'subjective-quality' : undefined);
        }
    });

    it('uses the same explicit variable-bitrate Quality for capability and Conversion only for the full A/B gate', async () => {
        window.history.replaceState({}, '', '/?media-debug=1&media-debug-audio=copy&media-debug-video-rate-control=bitrate');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);
        const capabilityQuality = state.videoCapabilityOptions[0].quality;
        const conversionQuality = state.videoOptions[0].quality;

        expect(result.wasCompressed).toBe(true);
        expect(capabilityQuality).toBe(conversionQuality);
        expect(capabilityQuality).toEqual({ options: { bitrate: 400_000, bitrateMode: 'variable' } });
        expect(state.videoCapabilityOptions[0]).toEqual(expect.objectContaining({ width: 640, height: 360, quality: capabilityQuality }));
        expect(state.videoOptions[0]).toEqual(expect.objectContaining({
            codec: 'avc',
            forceTranscode: true,
            width: 640,
            quality: conversionQuality,
        }));
        expect(state.audioOptions).toEqual([{}]);
        expect(record?.audioDiagnosticMode).toBe('force-packet-copy');
        expect(record?.videoRateControlMode).toBe('explicit-bitrate');
        expect(record?.video[0]).toEqual(expect.objectContaining({
            configuredBitrate: 400_000,
            bitrateMode: 'variable',
            quality: 'medium',
        }));
        expect(formatMediaCompressionDiagnostics()).toContain('video rate control: explicit-bitrate');
        expect(formatMediaCompressionDiagnostics()).toContain('configured video bitrate: 400000 bps');
        expect(formatMediaCompressionDiagnostics()).toContain('bitrate mode: variable');
    });

    it('keeps realtime disabled when diagnostics do not use forced audio copy', async () => {
        window.history.replaceState({}, '', '/?media-debug=1&media-debug-video-latency=realtime');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);

        expect(result.wasCompressed).toBe(true);
        expect(record?.videoDiagnosticMode).toBe('default-quality');
        expect(state.videoOptions[0]).not.toHaveProperty('latencyMode');
        expect(state.videoCapabilityOptions[0]).not.toHaveProperty('latencyMode');
        expect(state.audioOptions).toEqual([expect.objectContaining({ codec: 'aac', forceTranscode: true })]);
    });

    it('records the first native AAC decision in diagnostic mode without loading custom AAC', async () => {
        window.history.replaceState({}, '', '/?media-debug=1');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);

        expect(result.wasCompressed).toBe(true);
        expect(record).toMatchObject({
            conversionId: expect.any(Number),
            input: { mime: 'video/mp4' },
            aac: { stateAtStart: 'not-loaded' },
            audioDiagnosticMode: 'normal',
            audio: [{
                nativeCapabilityBeforeRegistration: true,
                customImport: 'no',
                effectiveEncodingMode: 'quality',
                configuredBitrate: 64_000,
                audioPath: 'native-aac',
                outputCodec: 'aac',
                outputSampleRate: 44100,
                outputChannels: 2,
            }],
        });
        const text = (await import('../../lib/videoCompression/mediaCompressionDiagnostics')).formatMediaCompressionDiagnostics();
        expect(text).toContain('effective audio encoding mode: quality');
        expect(text).toContain('configured audio bitrate: 64000');
        expect(text).not.toContain('target bitrate: 64000');
        expect(record?.timing['total compression']).toBeGreaterThanOrEqual(0);
        expect(state.registeredAacEncoder).toBe(0);
    });

    it('forces packet-copy audio in diagnostic A/B mode without loading custom AAC', async () => {
        window.history.replaceState({}, '', '/?media-debug=1&media-debug-audio=copy');
        state.outputAudioSampleRate = 48000;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);

        expect(result.wasCompressed).toBe(true);
        expect(state.registeredAacEncoder).toBe(0);
        expect(state.audioOptions).toEqual([{}]);
        expect(state.videoOptions[0]).not.toHaveProperty('latencyMode');
        expect(state.videoCapabilityOptions[0]).not.toHaveProperty('latencyMode');
        expect(record).toMatchObject({
            audioDiagnosticMode: 'force-packet-copy',
            audio: [{
                nativeCapabilityBeforeRegistration: true,
                capabilityBeforeSelection: true,
                effectiveEncodingMode: 'packet-copy',
                audioPath: 'packet-copy',
                reason: 'debug-forced-packet-copy',
                outputCodec: 'aac',
                outputSampleRate: 48000,
                outputChannels: 2,
            }],
        });
    });

    it('adds realtime latency to the video option and matching capability check only for the experimental A/B mode', async () => {
        window.history.replaceState({}, '', '/?media-debug=1&media-debug-audio=copy&media-debug-video-latency=realtime');
        state.outputVideoPacketCount = 620;
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);

        expect(result.wasCompressed).toBe(true);
        expect(state.registeredAacEncoder).toBe(0);
        expect(state.audioOptions).toEqual([{}]);
        expect(state.videoOptions[0]).toEqual(expect.objectContaining({
            codec: 'avc',
            forceTranscode: true,
            latencyMode: 'realtime',
        }));
        expect(state.videoCapabilityOptions[0]).toEqual(expect.objectContaining({
            latencyMode: 'realtime',
        }));
        expect(record).toMatchObject({
            audioDiagnosticMode: 'force-packet-copy',
            videoDiagnosticMode: 'realtime',
        });
        expect(record?.video[0]).toMatchObject({
            inputPacketStats: {
                packetCount: 627,
                averagePacketRate: 30,
                averageBitrate: 4_000_000,
                duration: 1.5,
            },
            outputPacketStats: {
                packetCount: 620,
                averagePacketRate: 29.8,
                averageBitrate: 3_900_000,
                duration: 1.5,
            },
        });
        expect(record?.timing['input video stats scan']).toBeGreaterThanOrEqual(0);
        expect(record?.timing['output video stats scan']).toBeGreaterThanOrEqual(0);
        expect(record?.timing['diagnostic total']).toBeGreaterThanOrEqual(record?.timing['total compression'] ?? 0);

        const text = formatMediaCompressionDiagnostics();
        expect(text).toContain('Video latency: realtime');
        expect(text).toContain('input frames: 627');
        expect(text).toContain('output frames: 620');
        expect(text).toContain('input video stats scan:');
        expect(text).toContain('output video stats scan:');
    });

    it('uses the existing video capability fallback when realtime latency is unsupported', async () => {
        state.canEncodeVideo = false;
        window.history.replaceState({}, '', '/?media-debug=1&media-debug-audio=copy&media-debug-video-latency=realtime');
        const file = videoFile();
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(file, options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);

        expect(result).toEqual({ file, wasCompressed: false, wasSkipped: true });
        expect(state.videoCapabilityOptions[0]).toEqual(expect.objectContaining({ latencyMode: 'realtime' }));
        expect(record).toMatchObject({
            videoDiagnosticMode: 'realtime',
            video: [{ avcEncode: false }],
            conversion: { fallback: true, fallbackReason: 'video-capability-unavailable' },
        });
    });

    it('does not load custom AAC when forced packet-copy mode observes unavailable native AAC', async () => {
        state.nativeAac = false;
        window.history.replaceState({}, '', '/?media-debug=1&media-debug-audio=copy');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);

        expect(result.wasCompressed).toBe(true);
        expect(state.registeredAacEncoder).toBe(0);
        expect(state.audioOptions).toEqual([{}]);
        expect(record?.audio[0]).toMatchObject({
            audioPath: 'packet-copy',
            reason: 'debug-forced-packet-copy',
        });
    });

    it('registers the optional AAC encoder only when native AAC encoding is unavailable', async () => {
        state.nativeAac = false;
        window.history.replaceState({}, '', '/?media-debug=1');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);
        expect(result.wasCompressed).toBe(true);
        expect(state.registeredAacEncoder).toBe(1);
        expect(record?.audio[0]).toMatchObject({
            nativeCapabilityBeforeRegistration: false,
            customImport: 'yes',
            customRegistration: 'success',
            capabilityAfterRegistration: true,
            audioPath: 'custom-aac',
        });
        expect(record?.aac.loadRegisterDuration).toBeGreaterThanOrEqual(0);
    });

    it('packet-copies audio when it cannot be decoded for AAC transcoding', async () => {
        state.canDecodeAudio = false;
        window.history.replaceState({}, '', '/?media-debug=1');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);
        expect(result.wasCompressed).toBe(true);
        expect(state.audioOptions).toEqual([{}]);
        expect(record?.audio[0]).toMatchObject({ audioPath: 'packet-copy', reason: 'decode-unavailable' });
    });

    it('labels a matching registered custom encoder as custom AAC on later conversions', async () => {
        state.customAac = true;
        window.history.replaceState({}, '', '/?media-debug=1');
        const result = await new MediaBunnyCompression(() => 64_000).compressWithMediabunny(videoFile(), options);
        const record = getMediaCompressionDiagnosticRecords().at(-1);

        expect(result.wasCompressed).toBe(true);
        expect(record?.aac.stateAtStart).toBe('registered');
        expect(record?.audio[0]).toMatchObject({
            customImport: 'already registered',
            audioPath: 'custom-aac',
        });
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
