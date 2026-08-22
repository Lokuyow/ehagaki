export const RAW_VIDEO_ENCODER_BENCHMARK_CONFIG = {
    codec: 'avc1.64001E',
    width: 360,
    height: 640,
    framerate: 30,
    bitrate: 400_000,
} as const satisfies VideoEncoderConfig;

export const RAW_VIDEO_ENCODER_BENCHMARK_FRAME_COUNT = 627;
export const RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT = 4;
export const RAW_VIDEO_ENCODER_BENCHMARK_SOURCE = 'canvas-2d synthetic pattern';

export type RawVideoEncoderBenchmarkFailureStage =
    | 'api-unavailable'
    | 'config-unsupported'
    | 'configure-failure'
    | 'setup-failure'
    | 'encode-failure'
    | 'flush-failure'
    | 'aborted';

export interface RawVideoEncoderBenchmarkTimings {
    configSupportCheck: number;
    encoderSetupConfigure: number;
    benchmarkWall: number;
    framePreparationSync: number;
    encodeSubmissionSync: number;
    backpressureWait: number;
    flushWait: number;
}

export interface RawVideoEncoderBenchmarkResult {
    status: 'completed' | 'failed';
    source: typeof RAW_VIDEO_ENCODER_BENCHMARK_SOURCE;
    config: VideoEncoderConfig;
    frameCount: number;
    queueLimit: number;
    maxQueueSize: number;
    timings: RawVideoEncoderBenchmarkTimings;
    framesSubmitted: number;
    chunks: number;
    bytes: number;
    keyChunks: number;
    deltaChunks: number;
    throughput?: number;
    failure?: {
        stage: RawVideoEncoderBenchmarkFailureStage;
        message: string;
    };
}

export interface RawVideoEncoderLike extends EventTarget {
    readonly encodeQueueSize: number;
    configure(config: VideoEncoderConfig): void;
    encode(frame: { close(): void }, options?: VideoEncoderEncodeOptions): void;
    flush(): Promise<void>;
    close(): void;
}

export interface RawVideoEncoderConstructor {
    new(init: {
        output: (chunk: { byteLength: number; type: EncodedVideoChunkType }) => void;
        error: (error: unknown) => void;
    }): RawVideoEncoderLike;
    isConfigSupported(config: VideoEncoderConfig): Promise<{ supported?: boolean; config?: VideoEncoderConfig }>;
}

interface RawVideoEncoderBenchmarkOptions {
    /** Test-only overrides keep the production benchmark fixed at 627 frames. */
    frameCount?: number;
    queueLimit?: number;
    VideoEncoder?: RawVideoEncoderConstructor | null;
    VideoFrame?: { new(source: CanvasImageSource, init: VideoFrameInit): { close(): void } } | null;
    createFrame?: (frameIndex: number, timestamp: number, duration: number) => { close(): void };
    now?: () => number;
    signal?: AbortSignal;
}

class BenchmarkAbortError extends Error {
    constructor() {
        super('Raw VideoEncoder benchmark was aborted.');
        this.name = 'AbortError';
    }
}

function shortErrorMessage(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    return message.replace(/[\r\n]+/g, ' ').slice(0, 240);
}

function createTimings(): RawVideoEncoderBenchmarkTimings {
    return {
        configSupportCheck: 0,
        encoderSetupConfigure: 0,
        benchmarkWall: 0,
        framePreparationSync: 0,
        encodeSubmissionSync: 0,
        backpressureWait: 0,
        flushWait: 0,
    };
}

export function rawVideoEncoderTimestampForFrame(frameIndex: number): number {
    return Math.round(frameIndex * 1_000_000 / RAW_VIDEO_ENCODER_BENCHMARK_CONFIG.framerate);
}

function makeFailure(
    stage: RawVideoEncoderBenchmarkFailureStage,
    message: string,
    timings: RawVideoEncoderBenchmarkTimings,
    frameCount: number,
    queueLimit: number,
    statistics: Pick<RawVideoEncoderBenchmarkResult, 'maxQueueSize' | 'framesSubmitted' | 'chunks' | 'bytes' | 'keyChunks' | 'deltaChunks'>,
): RawVideoEncoderBenchmarkResult {
    return {
        status: 'failed',
        source: RAW_VIDEO_ENCODER_BENCHMARK_SOURCE,
        config: { ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG },
        frameCount,
        queueLimit,
        timings,
        ...statistics,
        failure: { stage, message },
    };
}

function createSyntheticFrameFactory(
    VideoFrameConstructor: RawVideoEncoderBenchmarkOptions['VideoFrame'],
): (frameIndex: number, timestamp: number, duration: number) => { close(): void } {
    if (!VideoFrameConstructor || typeof document === 'undefined') {
        throw new Error('VideoFrame or Canvas 2D is unavailable.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = RAW_VIDEO_ENCODER_BENCHMARK_CONFIG.width;
    canvas.height = RAW_VIDEO_ENCODER_BENCHMARK_CONFIG.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D is unavailable.');

    return (frameIndex, timestamp, duration) => {
        const { width, height } = RAW_VIDEO_ENCODER_BENCHMARK_CONFIG;
        const barHeight = 64;
        const movingX = (frameIndex * 7) % width;
        const movingY = (frameIndex * 5) % (height - 120);

        context.fillStyle = '#10243d';
        context.fillRect(0, 0, width, height);
        context.fillStyle = '#284f73';
        context.fillRect(0, 0, width, barHeight);
        context.fillStyle = '#f4c95d';
        context.fillRect(0, height - barHeight, width, barHeight);
        context.fillStyle = '#ef8354';
        context.fillRect(movingX, movingY, 84, 84);
        context.fillStyle = '#4fb286';
        context.fillRect(width - movingX - 48, height - movingY - 140, 48, 48);
        context.fillStyle = '#ffffff';
        context.fillRect((frameIndex * 13) % width, 96, 4, height - 192);

        return new VideoFrameConstructor(canvas, { timestamp, duration });
    };
}

function createStatistics() {
    return {
        maxQueueSize: 0,
        framesSubmitted: 0,
        chunks: 0,
        bytes: 0,
        keyChunks: 0,
        deltaChunks: 0,
    };
}

function classifyFailure(error: unknown, phase: 'configure' | 'setup' | 'encode' | 'flush'): RawVideoEncoderBenchmarkFailureStage {
    if (error instanceof BenchmarkAbortError || (error instanceof DOMException && error.name === 'AbortError')) {
        return 'aborted';
    }
    if (phase === 'configure') return 'configure-failure';
    if (phase === 'setup') return 'setup-failure';
    return phase === 'flush' ? 'flush-failure' : 'encode-failure';
}

/**
 * Runs a deliberately small, native WebCodecs-only encoder benchmark. It does not
 * inspect or configure MediaBunny, mux output, or create a file.
 */
export async function runRawVideoEncoderBenchmark(
    options: RawVideoEncoderBenchmarkOptions = {},
): Promise<RawVideoEncoderBenchmarkResult> {
    const frameCount = options.frameCount ?? RAW_VIDEO_ENCODER_BENCHMARK_FRAME_COUNT;
    const queueLimit = options.queueLimit ?? RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT;
    const now = options.now ?? (() => performance.now());
    const timings = createTimings();
    const statistics = createStatistics();
    const VideoEncoderConstructor = options.VideoEncoder === undefined
        ? (globalThis.VideoEncoder as unknown as RawVideoEncoderConstructor | undefined)
        : options.VideoEncoder ?? undefined;
    const VideoFrameConstructor = options.VideoFrame === undefined
        ? (globalThis.VideoFrame as unknown as RawVideoEncoderBenchmarkOptions['VideoFrame'])
        : options.VideoFrame ?? undefined;

    if (!VideoEncoderConstructor || (!options.createFrame && !VideoFrameConstructor)) {
        return makeFailure('api-unavailable', 'VideoEncoder or VideoFrame is unavailable.', timings, frameCount, queueLimit, statistics);
    }

    const supportStartedAt = now();
    let support: { supported?: boolean };
    try {
        support = await VideoEncoderConstructor.isConfigSupported({ ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG });
    } catch (error) {
        timings.configSupportCheck = Math.max(0, now() - supportStartedAt);
        return makeFailure('config-unsupported', shortErrorMessage(error), timings, frameCount, queueLimit, statistics);
    }
    timings.configSupportCheck = Math.max(0, now() - supportStartedAt);
    if (!support.supported) {
        return makeFailure('config-unsupported', 'VideoEncoder does not support the fixed AVC configuration.', timings, frameCount, queueLimit, statistics);
    }

    let encoder: RawVideoEncoderLike | undefined;
    let phase: 'configure' | 'setup' | 'encode' | 'flush' = 'configure';
    let callbackError: unknown;
    const waitingRejectors = new Set<(error: unknown) => void>();
    const rejectWaiters = (error: unknown) => {
        for (const reject of waitingRejectors) reject(error);
        waitingRejectors.clear();
    };

    try {
        const setupStartedAt = now();
        encoder = new VideoEncoderConstructor({
            output: (chunk) => {
                statistics.chunks += 1;
                statistics.bytes += chunk.byteLength;
                if (chunk.type === 'key') statistics.keyChunks += 1;
                else statistics.deltaChunks += 1;
            },
            error: (error) => {
                callbackError ??= error;
                rejectWaiters(error);
            },
        });
        encoder.configure({ ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG });
        let createFrame: (frameIndex: number, timestamp: number, duration: number) => { close(): void };
        phase = 'setup';
        createFrame = options.createFrame ?? createSyntheticFrameFactory(VideoFrameConstructor);
        timings.encoderSetupConfigure = Math.max(0, now() - setupStartedAt);

        const benchmarkStartedAt = now();
        for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
            if (options.signal?.aborted) throw new BenchmarkAbortError();
            phase = 'encode';
            if (encoder.encodeQueueSize >= queueLimit) {
                const activeEncoder = encoder;
                const waitStartedAt = now();
                await new Promise<void>((resolve, reject) => {
                    const onDequeue = () => {
                        if (activeEncoder.encodeQueueSize < queueLimit) finish(resolve);
                    };
                    const onAbort = () => finish(() => reject(new BenchmarkAbortError()));
                    const rejectForEncoderError = (error: unknown) => finish(() => reject(error));
                    let finished = false;
                    const finish = (complete: () => void) => {
                        if (finished) return;
                        finished = true;
                        activeEncoder.removeEventListener('dequeue', onDequeue);
                        options.signal?.removeEventListener('abort', onAbort);
                        waitingRejectors.delete(rejectForEncoderError);
                        complete();
                    };
                    activeEncoder.addEventListener('dequeue', onDequeue);
                    options.signal?.addEventListener('abort', onAbort, { once: true });
                    waitingRejectors.add(rejectForEncoderError);
                    if (callbackError) rejectForEncoderError(callbackError);
                    else onDequeue();
                });
                timings.backpressureWait += Math.max(0, now() - waitStartedAt);
            }

            const timestamp = rawVideoEncoderTimestampForFrame(frameIndex);
            const nextTimestamp = rawVideoEncoderTimestampForFrame(frameIndex + 1);
            const framePreparationStartedAt = now();
            const frame = createFrame(frameIndex, timestamp, nextTimestamp - timestamp);
            timings.framePreparationSync += Math.max(0, now() - framePreparationStartedAt);
            try {
                const encodeStartedAt = now();
                encoder.encode(frame);
                timings.encodeSubmissionSync += Math.max(0, now() - encodeStartedAt);
                statistics.framesSubmitted += 1;
                statistics.maxQueueSize = Math.max(statistics.maxQueueSize, encoder.encodeQueueSize);
            } finally {
                frame.close();
            }
            if (callbackError) throw callbackError;
        }

        phase = 'flush';
        const flushStartedAt = now();
        await encoder.flush();
        timings.flushWait = Math.max(0, now() - flushStartedAt);
        if (callbackError) throw callbackError;
        timings.benchmarkWall = Math.max(0, now() - benchmarkStartedAt);

        return {
            status: 'completed',
            source: RAW_VIDEO_ENCODER_BENCHMARK_SOURCE,
            config: { ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG },
            frameCount,
            queueLimit,
            timings,
            ...statistics,
            throughput: timings.benchmarkWall > 0 ? statistics.framesSubmitted / (timings.benchmarkWall / 1_000) : undefined,
        };
    } catch (error) {
        return makeFailure(
            classifyFailure(error, phase),
            shortErrorMessage(error),
            timings,
            frameCount,
            queueLimit,
            statistics,
        );
    } finally {
        rejectWaiters(new BenchmarkAbortError());
        try {
            encoder?.close();
        } catch {
            // Closing an encoder already closed by the browser is safe to ignore.
        }
    }
}
