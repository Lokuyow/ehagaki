import { describe, expect, it, vi } from 'vitest';

import {
    runLegacyLikeCanvasPipelineBenchmark,
    type LegacyLikeCanvasPipelineBenchmarkFrameLike,
    type LegacyLikeCanvasPipelineBenchmarkSampleLike,
    type LegacyLikeCanvasPipelineBenchmarkSinkLike,
} from '../../lib/videoCompression/legacyLikeCanvasPipelineBenchmark';
import {
    RAW_VIDEO_ENCODER_BENCHMARK_CONFIG,
    RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT,
} from '../../lib/videoCompression/rawVideoEncoderBenchmark';
import type {
    RealVideoPipelineBenchmarkEncoderConstructor,
    RealVideoPipelineBenchmarkInputLike,
    RealVideoPipelineBenchmarkTrackLike,
} from '../../lib/videoCompression/realVideoPipelineBenchmark';

class FakeFrame implements LegacyLikeCanvasPipelineBenchmarkFrameLike {
    readonly displayWidth: number;
    readonly displayHeight: number;
    readonly close = vi.fn();

    constructor(width = 1_920, height = 1_080) {
        this.displayWidth = width;
        this.displayHeight = height;
    }
}

class FakeSample implements LegacyLikeCanvasPipelineBenchmarkSampleLike {
    timestamp: number;
    readonly duration = 1 / 30;
    readonly close = vi.fn();
    readonly setTimestamp = vi.fn((timestamp: number) => {
        this.timestamp = timestamp;
    });
    readonly transform = vi.fn();
    readonly toVideoFrame = vi.fn(() => {
        if (FakeSample.sourceFrameError) throw new Error('source frame stopped');
        const frame = new FakeFrame();
        FakeSample.sourceFrames.push(frame);
        return frame;
    });

    static sourceFrameError = false;
    static sourceFrames: FakeFrame[] = [];

    constructor(timestamp: number) {
        this.timestamp = timestamp;
    }

    static reset(): void {
        FakeSample.sourceFrameError = false;
        FakeSample.sourceFrames = [];
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

    encode(_frame: LegacyLikeCanvasPipelineBenchmarkFrameLike, options?: VideoEncoderEncodeOptions): void {
        FakeEncoder.encodeOptions.push(options ?? {});
        if (FakeEncoder.mode === 'encode-failure') {
            const error = new Error('encode stopped');
            this.error(error);
            throw error;
        }
        this.queueSize += 1;
        this.output({ byteLength: 100, type: options?.keyFrame === true ? 'key' : 'delta' });
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
        getFirstTimestamp: vi.fn(async () => 100),
    };
}

function createInput(track: RealVideoPipelineBenchmarkTrackLike | undefined, dispose: (() => void) | undefined = vi.fn()): RealVideoPipelineBenchmarkInputLike {
    return {
        getVideoTracks: vi.fn(async () => track ? [track] : []),
        getDurationFromMetadata: vi.fn(async () => 20.905),
        dispose,
    };
}

function createSink(samples: LegacyLikeCanvasPipelineBenchmarkSampleLike[]): LegacyLikeCanvasPipelineBenchmarkSinkLike {
    return {
        async *samples() {
            yield* samples;
        },
    };
}

function createCanvas(context: Partial<CanvasRenderingContext2D> | null) {
    const canvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => context),
    };
    return canvas as unknown as HTMLCanvasElement;
}

function createContext(throwOnDraw = false) {
    return {
        resetTransform: vi.fn(),
        setTransform: vi.fn(),
        clearRect: vi.fn(),
        save: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        scale: vi.fn(),
        drawImage: vi.fn(() => {
            if (throwOnDraw) throw new Error('canvas draw stopped');
        }),
        restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
}

function createOptions(
    track: RealVideoPipelineBenchmarkTrackLike | undefined,
    samples: LegacyLikeCanvasPipelineBenchmarkSampleLike[] = [],
    options: {
        dispose?: () => void;
        canvas?: HTMLCanvasElement | null;
        createOutputVideoFrame?: (canvas: HTMLCanvasElement, init: VideoFrameInit) => LegacyLikeCanvasPipelineBenchmarkFrameLike;
    } = {},
) {
    const input = createInput(track, options.dispose);
    return {
        VideoEncoder: FakeEncoder as unknown as RealVideoPipelineBenchmarkEncoderConstructor,
        createInput: () => input,
        createVideoSampleSink: (sinkTrack: RealVideoPipelineBenchmarkTrackLike) => {
            expect(sinkTrack).toBe(track);
            return createSink(samples);
        },
        createCanvas: () => options.canvas === undefined ? createCanvas(createContext()) : options.canvas,
        createOutputVideoFrame: options.createOutputVideoFrame,
        now: () => 100,
    };
}

describe('runLegacyLikeCanvasPipelineBenchmark', () => {
    it('uses public source VideoFrames, one reused HTMLCanvasElement, and no VideoSample.transform()', async () => {
        FakeEncoder.reset();
        FakeSample.reset();
        const context = createContext();
        const canvas = createCanvas(context);
        const samples = [new FakeSample(100), new FakeSample(100 + 1 / 30), new FakeSample(100 + 2 / 30)];
        const outputFrames: FakeFrame[] = [];
        const outputFrameInits: VideoFrameInit[] = [];
        const dispose = vi.fn();
        const result = await runLegacyLikeCanvasPipelineBenchmark(
            new File(['video'], 'private.mov', { type: 'video/quicktime' }),
            createOptions(createTrack(), samples, {
                dispose,
                canvas,
                createOutputVideoFrame: (_canvas, init) => {
                    outputFrameInits.push(init);
                    const frame = new FakeFrame(360, 640);
                    outputFrames.push(frame);
                    return frame;
                },
            }),
        );

        expect(result).toMatchObject({
            pipelineKind: 'legacy-like-html-canvas',
            status: 'completed',
            target: { width: 360, height: 640, fit: 'fill', rotate: 0, alpha: 'discard' },
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
        expect(canvas.width).toBe(360);
        expect(canvas.height).toBe(640);
        expect(canvas.getContext).toHaveBeenCalledTimes(1);
        expect(samples.every((sample) => sample.transform.mock.calls.length === 0)).toBe(true);
        expect(samples.every((sample) => sample.toVideoFrame.mock.calls.length === 1)).toBe(true);
        expect(outputFrameInits).toEqual([
            { timestamp: 0, duration: 33_333 },
            { timestamp: 33_333, duration: 33_333 },
            { timestamp: 66_667, duration: 33_333 },
        ]);
        expect(samples.every((sample) => sample.close.mock.calls.length === 1)).toBe(true);
        expect(FakeSample.sourceFrames.every((frame) => frame.close.mock.calls.length === 1)).toBe(true);
        expect(outputFrames.every((frame) => frame.close.mock.calls.length === 1)).toBe(true);
        expect(dispose).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(result)).not.toContain('private.mov');
    });

    it('bakes the portrait MOV 90° rotation into an upright 360x640 Canvas draw geometry', async () => {
        FakeEncoder.reset();
        FakeSample.reset();
        const context = createContext();
        const canvas = createCanvas(context);
        await runLegacyLikeCanvasPipelineBenchmark(
            new File(['video'], 'ignored.mov', { type: 'video/quicktime' }),
            createOptions(createTrack(), [new FakeSample(100)], { canvas, createOutputVideoFrame: () => new FakeFrame(360, 640) }),
        );

        expect(context.clearRect).toHaveBeenCalledWith(0, 0, 360, 640);
        expect(context.translate).toHaveBeenNthCalledWith(1, 180, 320);
        expect(context.rotate).toHaveBeenCalledWith(Math.PI / 2);
        expect(context.scale).toHaveBeenCalledWith(640 / 360, 360 / 640);
        expect(context.translate).toHaveBeenNthCalledWith(2, -180, -320);
        expect(context.drawImage).toHaveBeenCalledWith(
            expect.objectContaining({ displayWidth: 1_920, displayHeight: 1_080 }),
            0,
            0,
            1_920,
            1_080,
            0,
            0,
            360,
            640,
        );
    });

    it('normalizes MediaBunny second timestamps and schedules five-second keyframes without microsecond assumptions', async () => {
        FakeEncoder.reset();
        FakeSample.reset();
        const relativeTimestamps = [0, 4.999, 5, 9.999, 10];
        const samples = relativeTimestamps.map((timestamp) => new FakeSample(100 + timestamp));
        const outputFrameInits: VideoFrameInit[] = [];
        const result = await runLegacyLikeCanvasPipelineBenchmark(
            new File(['video'], 'ignored.mov', { type: 'video/quicktime' }),
            createOptions(createTrack(), samples, {
                createOutputVideoFrame: (_canvas, init) => {
                    outputFrameInits.push(init);
                    return new FakeFrame(360, 640);
                },
            }),
        );

        expect(result.status).toBe('completed');
        samples.forEach((sample, index) => {
            expect(sample.setTimestamp.mock.calls[0]?.[0]).toBeCloseTo(relativeTimestamps[index], 12);
        });
        expect(outputFrameInits.map((init) => init.timestamp)).toEqual([0, 4_999_000, 5_000_000, 9_999_000, 10_000_000]);
        expect(outputFrameInits.every((init) => init.duration === 33_333)).toBe(true);
        expect(FakeEncoder.encodeOptions).toEqual([
            { keyFrame: true },
            { keyFrame: false },
            { keyFrame: true },
            { keyFrame: false },
            { keyFrame: true },
        ]);
    });

    it.each([
        ['canvas unavailable', { canvas: null }, 'canvas-unavailable'],
        ['canvas context unavailable', { canvas: createCanvas(null) }, 'canvas-context-unavailable'],
    ] as const)('reports %s with cleanup', async (_name, options, stage) => {
        FakeEncoder.reset();
        const dispose = vi.fn();
        const result = await runLegacyLikeCanvasPipelineBenchmark(
            new File(['x'], 'ignored.mov', { type: 'video/quicktime' }),
            createOptions(createTrack(), [], { ...options, dispose }),
        );

        expect(result).toMatchObject({ status: 'failed', failure: { stage } });
        expect(dispose).toHaveBeenCalledTimes(1);
        expect(FakeEncoder.instances).toHaveLength(0);
    });

    it.each([
        ['source frame', 'source-frame-failure'],
        ['canvas draw', 'canvas-draw-failure'],
        ['encode', 'encode-failure'],
        ['flush', 'flush-failure'],
    ] as const)('classifies %s failures and closes every acquired resource', async (mode, stage) => {
        FakeEncoder.reset();
        FakeSample.reset();
        const sample = new FakeSample(100);
        const dispose = vi.fn();
        const context = createContext(mode === 'canvas draw');
        if (mode === 'source frame') FakeSample.sourceFrameError = true;
        if (mode === 'encode') FakeEncoder.mode = 'encode-failure';
        if (mode === 'flush') FakeEncoder.mode = 'flush-failure';
        const result = await runLegacyLikeCanvasPipelineBenchmark(
            new File(['x'], 'ignored.mov', { type: 'video/quicktime' }),
            createOptions(createTrack(), [sample], {
                dispose,
                canvas: createCanvas(context),
                createOutputVideoFrame: () => new FakeFrame(360, 640),
            }),
        );

        expect(result).toMatchObject({ status: 'failed', failure: { stage } });
        expect(sample.close).toHaveBeenCalledTimes(1);
        expect(dispose).toHaveBeenCalledTimes(1);
        expect(FakeEncoder.instances[0]?.close).toHaveBeenCalledTimes(1);
    });

    it('returns aborted without allocating Canvas or an encoder', async () => {
        FakeEncoder.reset();
        const controller = new AbortController();
        controller.abort();
        const createCanvasMock = vi.fn(() => createCanvas(createContext()));
        const result = await runLegacyLikeCanvasPipelineBenchmark(
            new File(['x'], 'ignored.mov', { type: 'video/quicktime' }),
            { ...createOptions(createTrack()), signal: controller.signal, createCanvas: createCanvasMock },
        );

        expect(result).toMatchObject({ status: 'failed', failure: { stage: 'aborted' } });
        expect(createCanvasMock).not.toHaveBeenCalled();
        expect(FakeEncoder.instances).toHaveLength(0);
    });

    it('keeps the existing native encoder conditions', () => {
        expect(RAW_VIDEO_ENCODER_BENCHMARK_CONFIG).toMatchObject({
            codec: 'avc1.64001E', width: 360, height: 640, framerate: 30, bitrate: 400_000,
        });
        expect(RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT).toBe(4);
    });
});
