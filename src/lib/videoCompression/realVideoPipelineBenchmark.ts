import {
    ALL_FORMATS,
    BlobSource,
    Input,
    VideoSampleSink,
    type InputVideoTrack,
    type VideoSampleTransformOptions,
} from 'mediabunny';

import { RAW_VIDEO_ENCODER_BENCHMARK_CONFIG, RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT } from './rawVideoEncoderBenchmark';

export const REAL_VIDEO_PIPELINE_BENCHMARK_TARGET = {
    width: RAW_VIDEO_ENCODER_BENCHMARK_CONFIG.width,
    height: RAW_VIDEO_ENCODER_BENCHMARK_CONFIG.height,
    fit: 'fill',
    rotate: 0,
    alpha: 'discard',
} as const satisfies VideoSampleTransformOptions;

const REAL_VIDEO_PIPELINE_KEY_FRAME_INTERVAL = 5;

export type RealVideoPipelineBenchmarkFailureStage =
    | 'no-video-track'
    | 'decode-unavailable'
    | 'encoder-unavailable'
    | 'config-unsupported'
    | 'transform-failure'
    | 'encode-failure'
    | 'flush-failure'
    | 'aborted'
    | 'setup-failure';

export interface RealVideoPipelineBenchmarkTimings {
    inputTrackSetup: number;
    sampleWaitIteration: number;
    videoTransform: number;
    videoFrameCreation: number;
    encodeSubmissionSync: number;
    backpressureWait: number;
    flushWait: number;
    benchmarkTotalWall: number;
}

export interface RealVideoPipelineBenchmarkResult {
    status: 'completed' | 'failed';
    input: {
        mime: string;
        size: number;
        duration: number | null;
        videoCodec: string | null;
        codedWidth: number | null;
        codedHeight: number | null;
        displayWidth: number | null;
        displayHeight: number | null;
        rotation: number | null;
    };
    target: {
        width: number;
        height: number;
        fit: 'fill';
        rotate: 0;
        alpha: 'discard';
    };
    capabilities: {
        decode: boolean | null;
        avcEncode: boolean | null;
    };
    samplesProcessed: number;
    framesSubmitted: number;
    encodedChunks: number;
    encodedBytes: number;
    keyChunks: number;
    deltaChunks: number;
    maxQueueSize: number;
    throughput: number | null;
    timings: RealVideoPipelineBenchmarkTimings;
    failure?: {
        stage: RealVideoPipelineBenchmarkFailureStage;
        message: string;
    };
}

export interface RealVideoPipelineBenchmarkSampleLike {
    timestamp: number;
    duration: number;
    codedWidth: number;
    codedHeight: number;
    rotation: number;
    setTimestamp(timestamp: number): void;
    transform(options: VideoSampleTransformOptions): Promise<RealVideoPipelineBenchmarkSampleLike>;
    toVideoFrame(): { close(): void };
    close(): void;
}

export interface RealVideoPipelineBenchmarkTrackLike {
    canDecode(): Promise<boolean>;
    getCodec(): Promise<string | null>;
    getCodedWidth(): Promise<number>;
    getCodedHeight(): Promise<number>;
    getDisplayWidth(): Promise<number>;
    getDisplayHeight(): Promise<number>;
    getRotation(): Promise<number>;
    getFirstTimestamp(): Promise<number>;
}

export interface RealVideoPipelineBenchmarkInputLike {
    getVideoTracks(): Promise<RealVideoPipelineBenchmarkTrackLike[]>;
    getDurationFromMetadata(): Promise<number | null>;
    dispose(): void;
}

export interface RealVideoPipelineBenchmarkSinkLike {
    samples(): AsyncIterable<RealVideoPipelineBenchmarkSampleLike>;
}

export interface RealVideoPipelineBenchmarkOptions {
    signal?: AbortSignal;
    now?: () => number;
    VideoEncoder?: RealVideoPipelineBenchmarkEncoderConstructor | null;
    createInput?: (file: File) => RealVideoPipelineBenchmarkInputLike;
    createVideoSampleSink?: (track: RealVideoPipelineBenchmarkTrackLike) => RealVideoPipelineBenchmarkSinkLike;
}

interface RealVideoPipelineBenchmarkEncoder extends EventTarget {
    readonly encodeQueueSize: number;
    configure(config: VideoEncoderConfig): void;
    encode(frame: { close(): void }, options?: VideoEncoderEncodeOptions): void;
    flush(): Promise<void>;
    close(): void;
}

export interface RealVideoPipelineBenchmarkEncoderConstructor {
    new(init: {
        output: (chunk: { byteLength: number; type: EncodedVideoChunkType }) => void;
        error: (error: unknown) => void;
    }): RealVideoPipelineBenchmarkEncoder;
    isConfigSupported(config: VideoEncoderConfig): Promise<{ supported?: boolean; config?: VideoEncoderConfig }>;
}

class RealVideoPipelineBenchmarkAbortError extends Error {
    constructor() {
        super('Real video pipeline benchmark was aborted.');
        this.name = 'AbortError';
    }
}

function shortErrorMessage(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    return message.replace(/[\r\n]+/g, ' ').slice(0, 240);
}

function createTimings(): RealVideoPipelineBenchmarkTimings {
    return {
        inputTrackSetup: 0,
        sampleWaitIteration: 0,
        videoTransform: 0,
        videoFrameCreation: 0,
        encodeSubmissionSync: 0,
        backpressureWait: 0,
        flushWait: 0,
        benchmarkTotalWall: 0,
    };
}

function createResult(file: File): RealVideoPipelineBenchmarkResult {
    return {
        status: 'failed',
        input: {
            mime: file.type || 'unknown',
            size: file.size,
            duration: null,
            videoCodec: null,
            codedWidth: null,
            codedHeight: null,
            displayWidth: null,
            displayHeight: null,
            rotation: null,
        },
        target: { ...REAL_VIDEO_PIPELINE_BENCHMARK_TARGET },
        capabilities: { decode: null, avcEncode: null },
        samplesProcessed: 0,
        framesSubmitted: 0,
        encodedChunks: 0,
        encodedBytes: 0,
        keyChunks: 0,
        deltaChunks: 0,
        maxQueueSize: 0,
        throughput: null,
        timings: createTimings(),
    };
}

function createProductionInput(file: File): RealVideoPipelineBenchmarkInputLike {
    return new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
}

function createProductionVideoSampleSink(track: RealVideoPipelineBenchmarkTrackLike): RealVideoPipelineBenchmarkSinkLike {
    return new VideoSampleSink(track as InputVideoTrack);
}

function throwIfAborted(signal: AbortSignal | undefined): void {
    if (signal?.aborted) throw new RealVideoPipelineBenchmarkAbortError();
}

async function waitForEncoderQueue(
    encoder: RealVideoPipelineBenchmarkEncoder,
    queueLimit: number,
    signal: AbortSignal | undefined,
    callbackError: () => unknown,
    waitingRejectors: Set<(error: unknown) => void>,
): Promise<void> {
    if (encoder.encodeQueueSize < queueLimit) return;

    await new Promise<void>((resolve, reject) => {
        let finished = false;
        const finish = (complete: () => void) => {
            if (finished) return;
            finished = true;
            encoder.removeEventListener('dequeue', onDequeue);
            signal?.removeEventListener('abort', onAbort);
            waitingRejectors.delete(rejectForEncoderError);
            complete();
        };
        const onDequeue = () => {
            if (encoder.encodeQueueSize < queueLimit) finish(resolve);
        };
        const onAbort = () => finish(() => reject(new RealVideoPipelineBenchmarkAbortError()));
        const rejectForEncoderError = (error: unknown) => finish(() => reject(error));
        encoder.addEventListener('dequeue', onDequeue);
        signal?.addEventListener('abort', onAbort, { once: true });
        waitingRejectors.add(rejectForEncoderError);
        const error = callbackError();
        if (error) rejectForEncoderError(error);
        else onDequeue();
    });
}

function classifyFailure(
    error: unknown,
    phase: 'setup' | 'transform' | 'encode' | 'flush',
    signal: AbortSignal | undefined,
): RealVideoPipelineBenchmarkFailureStage {
    if (signal?.aborted || error instanceof RealVideoPipelineBenchmarkAbortError) return 'aborted';
    if (phase === 'transform') return 'transform-failure';
    if (phase === 'encode') return 'encode-failure';
    if (phase === 'flush') return 'flush-failure';
    return 'setup-failure';
}

/**
 * Runs MediaBunny's public decode and VideoSample.transform pipeline directly into
 * native WebCodecs. It deliberately does not use Conversion, Output, muxing, or files.
 */
export async function runRealVideoPipelineBenchmark(
    file: File,
    options: RealVideoPipelineBenchmarkOptions = {},
): Promise<RealVideoPipelineBenchmarkResult> {
    const now = options.now ?? (() => performance.now());
    const result = createResult(file);
    const createInput = options.createInput ?? createProductionInput;
    const createVideoSampleSink = options.createVideoSampleSink ?? createProductionVideoSampleSink;
    const VideoEncoderConstructor = options.VideoEncoder === undefined
        ? (globalThis.VideoEncoder as unknown as RealVideoPipelineBenchmarkEncoderConstructor | undefined)
        : options.VideoEncoder ?? undefined;
    let input: RealVideoPipelineBenchmarkInputLike | undefined;
    let inputDisposed = false;
    let encoder: RealVideoPipelineBenchmarkEncoder | undefined;
    let callbackError: unknown;
    let phase: 'setup' | 'transform' | 'encode' | 'flush' = 'setup';
    const waitingRejectors = new Set<(error: unknown) => void>();
    const benchmarkStartedAt = now();

    const disposeInput = () => {
        if (!input || inputDisposed) return;
        inputDisposed = true;
        try {
            input.dispose();
        } catch {
            // Cleanup errors must not replace the benchmark result.
        }
    };
    const rejectWaiters = (error: unknown) => {
        for (const reject of waitingRejectors) reject(error);
        waitingRejectors.clear();
    };
    const abortInput = () => {
        rejectWaiters(new RealVideoPipelineBenchmarkAbortError());
        disposeInput();
    };
    options.signal?.addEventListener('abort', abortInput, { once: true });

    try {
        throwIfAborted(options.signal);
        const setupStartedAt = now();
        input = createInput(file);
        const [videoTracks, duration] = await Promise.all([
            input.getVideoTracks(),
            input.getDurationFromMetadata(),
        ]);
        throwIfAborted(options.signal);
        result.input.duration = duration;

        const track = videoTracks[0];
        if (!track) {
            result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'no-video-track', message: 'The input has no video track.' };
            return result;
        }

        const [canDecode, videoCodec, codedWidth, codedHeight, displayWidth, displayHeight, rotation, firstTimestamp] = await Promise.all([
            track.canDecode(),
            track.getCodec(),
            track.getCodedWidth(),
            track.getCodedHeight(),
            track.getDisplayWidth(),
            track.getDisplayHeight(),
            track.getRotation(),
            track.getFirstTimestamp(),
        ]);
        result.input.videoCodec = videoCodec;
        result.input.codedWidth = codedWidth;
        result.input.codedHeight = codedHeight;
        result.input.displayWidth = displayWidth;
        result.input.displayHeight = displayHeight;
        result.input.rotation = rotation;
        result.capabilities.decode = canDecode;
        if (!canDecode) {
            result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'decode-unavailable', message: 'This video track cannot be decoded by this browser.' };
            return result;
        }
        if (!VideoEncoderConstructor) {
            result.capabilities.avcEncode = false;
            result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'encoder-unavailable', message: 'VideoEncoder is unavailable.' };
            return result;
        }

        let support: { supported?: boolean };
        try {
            support = await VideoEncoderConstructor.isConfigSupported({ ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG });
        } catch (error) {
            result.capabilities.avcEncode = false;
            result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'config-unsupported', message: shortErrorMessage(error) };
            return result;
        }
        result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);
        if (!support.supported) {
            result.capabilities.avcEncode = false;
            result.failure = { stage: 'config-unsupported', message: 'VideoEncoder does not support the fixed AVC configuration.' };
            return result;
        }
        result.capabilities.avcEncode = true;

        encoder = new VideoEncoderConstructor({
            output: (chunk) => {
                result.encodedChunks += 1;
                result.encodedBytes += chunk.byteLength;
                if (chunk.type === 'key') result.keyChunks += 1;
                else result.deltaChunks += 1;
            },
            error: (error) => {
                callbackError ??= error;
                rejectWaiters(error);
            },
        });
        encoder.configure({ ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG });

        const sink = createVideoSampleSink(track);
        const iterator = sink.samples()[Symbol.asyncIterator]();
        let lastKeyFrameInterval = -1;
        while (true) {
            throwIfAborted(options.signal);
            const sampleWaitStartedAt = now();
            const next = await iterator.next();
            result.timings.sampleWaitIteration += Math.max(0, now() - sampleWaitStartedAt);
            if (next.done) break;

            const sample = next.value;
            result.samplesProcessed += 1;
            try {
                throwIfAborted(options.signal);
                sample.setTimestamp(Math.max(sample.timestamp - firstTimestamp, 0));
                phase = 'transform';
                const transformStartedAt = now();
                const transformedSample = await sample.transform(REAL_VIDEO_PIPELINE_BENCHMARK_TARGET);
                result.timings.videoTransform += Math.max(0, now() - transformStartedAt);
                try {
                    const frameStartedAt = now();
                    const frame = transformedSample.toVideoFrame();
                    result.timings.videoFrameCreation += Math.max(0, now() - frameStartedAt);
                    try {
                        phase = 'encode';
                        const waitStartedAt = now();
                        await waitForEncoderQueue(
                            encoder,
                            RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT,
                            options.signal,
                            () => callbackError,
                            waitingRejectors,
                        );
                        result.timings.backpressureWait += Math.max(0, now() - waitStartedAt);
                        const encodeStartedAt = now();
                        const keyFrameInterval = Math.floor(sample.timestamp / REAL_VIDEO_PIPELINE_KEY_FRAME_INTERVAL);
                        const keyFrame = keyFrameInterval !== lastKeyFrameInterval;
                        lastKeyFrameInterval = keyFrameInterval;
                        encoder.encode(frame, { keyFrame });
                        result.timings.encodeSubmissionSync += Math.max(0, now() - encodeStartedAt);
                        result.framesSubmitted += 1;
                        result.maxQueueSize = Math.max(result.maxQueueSize, encoder.encodeQueueSize);
                        if (callbackError) throw callbackError;
                    } finally {
                        frame.close();
                    }
                } finally {
                    transformedSample.close();
                }
            } catch (error) {
                phase = phase === 'transform' ? 'transform' : 'encode';
                throw error;
            } finally {
                sample.close();
            }
        }

        phase = 'flush';
        const flushStartedAt = now();
        await encoder.flush();
        result.timings.flushWait = Math.max(0, now() - flushStartedAt);
        if (callbackError) throw callbackError;
        result.timings.benchmarkTotalWall = Math.max(0, now() - benchmarkStartedAt);
        result.throughput = result.timings.benchmarkTotalWall > 0
            ? result.framesSubmitted / (result.timings.benchmarkTotalWall / 1_000)
            : null;
        result.status = 'completed';
        return result;
    } catch (error) {
        result.failure = {
            stage: classifyFailure(error, phase, options.signal),
            message: shortErrorMessage(error),
        };
        result.timings.benchmarkTotalWall = Math.max(0, now() - benchmarkStartedAt);
        return result;
    } finally {
        options.signal?.removeEventListener('abort', abortInput);
        rejectWaiters(new RealVideoPipelineBenchmarkAbortError());
        if (result.timings.benchmarkTotalWall === 0) {
            result.timings.benchmarkTotalWall = Math.max(0, now() - benchmarkStartedAt);
        }
        try {
            encoder?.close();
        } catch {
            // Closing an encoder already closed by the browser is safe to ignore.
        }
        disposeInput();
    }
}
