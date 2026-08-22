import { describe, expect, it, vi } from 'vitest';
import {
    RAW_VIDEO_ENCODER_BENCHMARK_CONFIG,
    RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT,
} from '../../lib/videoCompression/rawVideoEncoderBenchmark';
import {
    REAL_VIDEO_PIPELINE_BENCHMARK_TARGET,
    runRealVideoPipelineBenchmark,
    type RealVideoPipelineBenchmarkEncoderConstructor,
    type RealVideoPipelineBenchmarkInputLike,
    type RealVideoPipelineBenchmarkSampleLike,
    type RealVideoPipelineBenchmarkSinkLike,
    type RealVideoPipelineBenchmarkTrackLike,
} from '../../lib/videoCompression/realVideoPipelineBenchmark';
import type { VideoSampleTransformOptions } from 'mediabunny';

class FakeFrame {
    close = vi.fn();
}

class FakeSample implements RealVideoPipelineBenchmarkSampleLike {
    timestamp: number;
    readonly duration = 33_333;
    readonly codedWidth = 1_920;
    readonly codedHeight = 1_080;
    readonly rotation = 90;
    readonly close = vi.fn();
    readonly setTimestamp = vi.fn((timestamp: number) => {
        this.timestamp = timestamp;
    });
    readonly transform = vi.fn(async (options: VideoSampleTransformOptions) => {
        FakeSample.lastTransformOptions = options;
        if (FakeSample.transformError) throw new Error('transform stopped');
        const transformed = new FakeSample(this.timestamp);
        FakeSample.transformedSamples.push(transformed);
        return transformed;
    });
    readonly toVideoFrame = vi.fn(() => {
        const frame = new FakeFrame();
        FakeSample.frames.push(frame);
        return frame;
    });

    static lastTransformOptions: unknown;
    static transformError = false;
    static transformedSamples: FakeSample[] = [];
    static frames: FakeFrame[] = [];

    constructor(timestamp: number) {
        this.timestamp = timestamp;
    }

    static reset(): void {
        FakeSample.lastTransformOptions = undefined;
        FakeSample.transformError = false;
        FakeSample.transformedSamples = [];
        FakeSample.frames = [];
    }
}

class FakeEncoder extends EventTarget {
    static supportConfigs: VideoEncoderConfig[] = [];
    static configureConfigs: VideoEncoderConfig[] = [];
    static encodeOptions: VideoEncoderEncodeOptions[] = [];
    static mode: 'success' | 'encode-failure' | 'flush-failure' = 'success';
    static instances: FakeEncoder[] = [];
    static supported = true;

    private queueSize = 0;
    private readonly output: (chunk: { byteLength: number; type: EncodedVideoChunkType }) => void;
    private readonly error: (error: unknown) => void;
    readonly close = vi.fn();

    constructor(init: {
        output: (chunk: { byteLength: number; type: EncodedVideoChunkType }) => void;
        error: (error: unknown) => void;
    }) {
        super();
        this.output = init.output;
        this.error = init.error;
        FakeEncoder.instances.push(this);
    }

    get encodeQueueSize(): number {
        return this.queueSize;
    }

    configure(config: VideoEncoderConfig): void {
        FakeEncoder.configureConfigs.push(config);
    }

    encode(_frame: { close(): void }, options?: VideoEncoderEncodeOptions): void {
        FakeEncoder.encodeOptions.push(options ?? {});
        if (FakeEncoder.mode === 'encode-failure') {
            const error = new Error('encode stopped');
            this.error(error);
            throw error;
        }
        this.queueSize += 1;
        this.output({ byteLength: 100, type: FakeEncoder.encodeOptions.length === 1 ? 'key' : 'delta' });
        queueMicrotask(() => {
            this.queueSize = Math.max(0, this.queueSize - 1);
            this.dispatchEvent(new Event('dequeue'));
        });
    }

    async flush(): Promise<void> {
        if (FakeEncoder.mode === 'flush-failure') {
            const error = new Error('flush stopped');
            this.error(error);
            throw error;
        }
    }

    static isConfigSupported = vi.fn(async (config: VideoEncoderConfig) => {
        FakeEncoder.supportConfigs.push(config);
        return { supported: FakeEncoder.supported, config };
    });

    static reset(): void {
        FakeEncoder.supportConfigs = [];
        FakeEncoder.configureConfigs = [];
        FakeEncoder.encodeOptions = [];
        FakeEncoder.mode = 'success';
        FakeEncoder.instances = [];
        FakeEncoder.supported = true;
        FakeEncoder.isConfigSupported.mockClear();
    }
}

function createTrack(canDecode = true): RealVideoPipelineBenchmarkTrackLike {
    return {
        canDecode: vi.fn(async () => canDecode),
        getCodec: vi.fn(async () => 'avc1.4d401f'),
        getCodedWidth: vi.fn(async () => 1_920),
        getCodedHeight: vi.fn(async () => 1_080),
        getDisplayWidth: vi.fn(async () => 1_080),
        getDisplayHeight: vi.fn(async () => 1_920),
        getRotation: vi.fn(async () => 90),
        getFirstTimestamp: vi.fn(async () => 100_000),
    };
}

function createInput(track: RealVideoPipelineBenchmarkTrackLike | undefined, dispose = vi.fn()): RealVideoPipelineBenchmarkInputLike {
    return {
        getVideoTracks: vi.fn(async () => track ? [track] : []),
        getDurationFromMetadata: vi.fn(async () => 20.9),
        dispose,
    };
}

function createSink(samples: RealVideoPipelineBenchmarkSampleLike[]): RealVideoPipelineBenchmarkSinkLike {
    return {
        async *samples() {
            yield* samples;
        },
    };
}

function encoderConstructor(): RealVideoPipelineBenchmarkEncoderConstructor {
    return FakeEncoder as unknown as RealVideoPipelineBenchmarkEncoderConstructor;
}

function createOptions(
    track: RealVideoPipelineBenchmarkTrackLike | undefined,
    samples: RealVideoPipelineBenchmarkSampleLike[] = [],
    dispose = vi.fn(),
) {
    const input = createInput(track, dispose);
    return {
        VideoEncoder: encoderConstructor(),
        createInput: () => input,
        createVideoSampleSink: (sinkTrack: RealVideoPipelineBenchmarkTrackLike) => {
            expect(sinkTrack).toBe(track);
            return createSink(samples);
        },
        now: () => 100,
    };
}

describe('runRealVideoPipelineBenchmark', () => {
    it('uses the fixed High Profile AVC config and transforms every sample into native WebCodecs', async () => {
        FakeEncoder.reset();
        FakeSample.reset();
        const samples = [new FakeSample(100_000), new FakeSample(133_333), new FakeSample(166_666)];
        const dispose = vi.fn();
        const result = await runRealVideoPipelineBenchmark(
            new File(['video'], 'private.mov', { type: 'video/quicktime' }),
            createOptions(createTrack(), samples, dispose),
        );

        expect(result).toMatchObject({
            status: 'completed',
            input: {
                mime: 'video/quicktime',
                size: 5,
                duration: 20.9,
                videoCodec: 'avc1.4d401f',
                codedWidth: 1920,
                codedHeight: 1080,
                displayWidth: 1080,
                displayHeight: 1920,
                rotation: 90,
            },
            target: REAL_VIDEO_PIPELINE_BENCHMARK_TARGET,
            capabilities: { decode: true, avcEncode: true },
            samplesProcessed: 3,
            framesSubmitted: 3,
            encodedChunks: 3,
            encodedBytes: 300,
            keyChunks: 1,
            deltaChunks: 2,
        });
        expect(FakeEncoder.supportConfigs).toEqual([{ ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG }]);
        expect(FakeEncoder.configureConfigs).toEqual([{ ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG }]);
        expect(FakeEncoder.encodeOptions).toEqual([{ keyFrame: true }, { keyFrame: false }, { keyFrame: false }]);
        expect(FakeSample.lastTransformOptions).toEqual(REAL_VIDEO_PIPELINE_BENCHMARK_TARGET);
        expect(samples.every((sample) => sample.setTimestamp.mock.calls.length === 1)).toBe(true);
        expect(samples.every((sample) => sample.close.mock.calls.length === 1)).toBe(true);
        expect(FakeSample.transformedSamples.every((sample) => sample.close.mock.calls.length === 1)).toBe(true);
        expect(FakeSample.frames.every((frame) => frame.close.mock.calls.length === 1)).toBe(true);
        expect(dispose).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(result)).not.toContain('private.mov');
    });

    it('keeps the 360x640, 30fps, 400kbps raw encoder conditions as the native encode target', () => {
        expect(RAW_VIDEO_ENCODER_BENCHMARK_CONFIG).toMatchObject({
            codec: 'avc1.64001E', width: 360, height: 640, framerate: 30, bitrate: 400_000,
        });
        expect(RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT).toBe(4);
    });

    it.each([
        ['no video track', undefined, 'no-video-track'],
        ['decoder unavailable', createTrack(false), 'decode-unavailable'],
    ] as const)('reports %s before sample iteration', async (_name, track, stage) => {
        FakeEncoder.reset();
        const dispose = vi.fn();
        const result = await runRealVideoPipelineBenchmark(new File(['x'], 'ignored.mov', { type: 'video/quicktime' }), createOptions(track, [], dispose));

        expect(result).toMatchObject({ status: 'failed', failure: { stage } });
        expect(dispose).toHaveBeenCalledTimes(1);
        expect(FakeEncoder.supportConfigs).toHaveLength(0);
    });

    it('does not silently fall back when the fixed AVC config is unsupported', async () => {
        FakeEncoder.reset();
        FakeEncoder.supported = false;
        const result = await runRealVideoPipelineBenchmark(
            new File(['x'], 'ignored.mov', { type: 'video/quicktime' }),
            createOptions(createTrack()),
        );

        expect(result).toMatchObject({
            status: 'failed',
            capabilities: { decode: true, avcEncode: false },
            failure: { stage: 'config-unsupported' },
        });
        expect(FakeEncoder.configureConfigs).toHaveLength(0);
    });

    it('classifies transform, encode, and flush failures and still cleans up resources', async () => {
        for (const [mode, stage] of [
            ['transform', 'transform-failure'],
            ['encode-failure', 'encode-failure'],
            ['flush-failure', 'flush-failure'],
        ] as const) {
            FakeEncoder.reset();
            FakeSample.reset();
            FakeEncoder.mode = mode === 'transform' ? 'success' : mode;
            FakeSample.transformError = mode === 'transform';
            const sample = new FakeSample(100_000);
            const dispose = vi.fn();
            const result = await runRealVideoPipelineBenchmark(
                new File(['x'], 'ignored.mov', { type: 'video/quicktime' }),
                createOptions(createTrack(), [sample], dispose),
            );

            expect(result).toMatchObject({ status: 'failed', failure: { stage } });
            expect(sample.close).toHaveBeenCalledTimes(1);
            expect(dispose).toHaveBeenCalledTimes(1);
            expect(FakeEncoder.instances[0]?.close).toHaveBeenCalledTimes(1);
        }
    });

    it('returns aborted and disposes input before any benchmark fallback can occur', async () => {
        FakeEncoder.reset();
        const controller = new AbortController();
        controller.abort();
        const dispose = vi.fn();
        const result = await runRealVideoPipelineBenchmark(
            new File(['x'], 'ignored.mov', { type: 'video/quicktime' }),
            { ...createOptions(createTrack(), [], dispose), signal: controller.signal },
        );

        expect(result).toMatchObject({ status: 'failed', failure: { stage: 'aborted' } });
        expect(dispose).not.toHaveBeenCalled();
        expect(FakeEncoder.instances).toHaveLength(0);
    });
});
