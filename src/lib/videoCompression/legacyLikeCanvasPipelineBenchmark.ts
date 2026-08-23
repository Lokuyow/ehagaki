import {
    ALL_FORMATS,
    BlobSource,
    Input,
    VideoSampleSink,
    type InputVideoTrack,
} from 'mediabunny';

import { RAW_VIDEO_ENCODER_BENCHMARK_CONFIG, RAW_VIDEO_ENCODER_BENCHMARK_QUEUE_LIMIT } from './rawVideoEncoderBenchmark';
import {
    REAL_VIDEO_PIPELINE_BENCHMARK_TARGET,
    REAL_VIDEO_PIPELINE_KEY_FRAME_INTERVAL,
    type RealVideoPipelineBenchmarkEncoderConstructor,
    type RealVideoPipelineBenchmarkInputLike,
    type RealVideoPipelineBenchmarkSinkLike,
    type RealVideoPipelineBenchmarkTrackLike,
} from './realVideoPipelineBenchmark';

export type LegacyLikeCanvasPipelineBenchmarkFailureStage =
    | 'no-video-track'
    | 'decode-unavailable'
    | 'encoder-unavailable'
    | 'config-unsupported'
    | 'canvas-unavailable'
    | 'canvas-context-unavailable'
    | 'source-frame-failure'
    | 'canvas-draw-failure'
    | 'encode-failure'
    | 'flush-failure'
    | 'aborted'
    | 'setup-failure';

export interface LegacyLikeCanvasPipelineBenchmarkTimings {
    inputTrackSetup: number;
    sampleWaitIteration: number;
    sourceVideoFrameAcquisition: number;
    canvasDrawRotationResize: number;
    outputVideoFrameCreation: number;
    encodeSubmissionSync: number;
    backpressureWait: number;
    flushWait: number;
    benchmarkTotalWall: number;
}

export interface LegacyLikeCanvasPipelineBenchmarkResult {
    pipelineKind: 'legacy-like-html-canvas';
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
    target: typeof REAL_VIDEO_PIPELINE_BENCHMARK_TARGET;
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
    timings: LegacyLikeCanvasPipelineBenchmarkTimings;
    failure?: {
        stage: LegacyLikeCanvasPipelineBenchmarkFailureStage;
        message: string;
    };
}

export interface LegacyLikeCanvasPipelineBenchmarkFrameLike {
    readonly displayWidth: number;
    readonly displayHeight: number;
    close(): void;
}

export interface LegacyLikeCanvasPipelineBenchmarkSampleLike {
    timestamp: number;
    duration: number;
    setTimestamp(timestamp: number): void;
    toVideoFrame(): LegacyLikeCanvasPipelineBenchmarkFrameLike;
    close(): void;
}

export interface LegacyLikeCanvasPipelineBenchmarkSinkLike extends Omit<RealVideoPipelineBenchmarkSinkLike, 'samples'> {
    samples(): AsyncIterable<LegacyLikeCanvasPipelineBenchmarkSampleLike>;
}

export interface LegacyLikeCanvasPipelineBenchmarkOptions {
    signal?: AbortSignal;
    now?: () => number;
    VideoEncoder?: RealVideoPipelineBenchmarkEncoderConstructor | null;
    createInput?: (file: File) => RealVideoPipelineBenchmarkInputLike;
    createVideoSampleSink?: (track: RealVideoPipelineBenchmarkTrackLike) => LegacyLikeCanvasPipelineBenchmarkSinkLike;
    createCanvas?: () => HTMLCanvasElement | null;
    createOutputVideoFrame?: (
        canvas: HTMLCanvasElement,
        init: VideoFrameInit,
    ) => LegacyLikeCanvasPipelineBenchmarkFrameLike;
}

interface LegacyLikeCanvasPipelineBenchmarkEncoder extends EventTarget {
    readonly encodeQueueSize: number;
    configure(config: VideoEncoderConfig): void;
    encode(frame: LegacyLikeCanvasPipelineBenchmarkFrameLike, options?: VideoEncoderEncodeOptions): void;
    flush(): Promise<void>;
    close(): void;
}

class LegacyLikeCanvasPipelineBenchmarkAbortError extends Error {
    constructor() {
        super('Legacy-like Canvas pipeline benchmark was aborted.');
        this.name = 'AbortError';
    }
}

function shortErrorMessage(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    return message.replace(/[\r\n]+/g, ' ').slice(0, 240);
}

function createTimings(): LegacyLikeCanvasPipelineBenchmarkTimings {
    return {
        inputTrackSetup: 0,
        sampleWaitIteration: 0,
        sourceVideoFrameAcquisition: 0,
        canvasDrawRotationResize: 0,
        outputVideoFrameCreation: 0,
        encodeSubmissionSync: 0,
        backpressureWait: 0,
        flushWait: 0,
        benchmarkTotalWall: 0,
    };
}

function createResult(file: File): LegacyLikeCanvasPipelineBenchmarkResult {
    return {
        pipelineKind: 'legacy-like-html-canvas',
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
        target: REAL_VIDEO_PIPELINE_BENCHMARK_TARGET,
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

function createProductionVideoSampleSink(track: RealVideoPipelineBenchmarkTrackLike): LegacyLikeCanvasPipelineBenchmarkSinkLike {
    return new VideoSampleSink(track as InputVideoTrack) as unknown as LegacyLikeCanvasPipelineBenchmarkSinkLike;
}

function createProductionCanvas(): HTMLCanvasElement | null {
    return typeof document === 'undefined' ? null : document.createElement('canvas');
}

function createProductionOutputVideoFrame(
    canvas: HTMLCanvasElement,
    init: VideoFrameInit,
): LegacyLikeCanvasPipelineBenchmarkFrameLike {
    if (typeof globalThis.VideoFrame !== 'function') {
        throw new Error('VideoFrame is unavailable.');
    }
    return new globalThis.VideoFrame(canvas, init);
}

function throwIfAborted(signal: AbortSignal | undefined): void {
    if (signal?.aborted) throw new LegacyLikeCanvasPipelineBenchmarkAbortError();
}

async function waitForEncoderQueue(
    encoder: LegacyLikeCanvasPipelineBenchmarkEncoder,
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
        const onAbort = () => finish(() => reject(new LegacyLikeCanvasPipelineBenchmarkAbortError()));
        const rejectForEncoderError = (error: unknown) => finish(() => reject(error));
        encoder.addEventListener('dequeue', onDequeue);
        signal?.addEventListener('abort', onAbort, { once: true });
        waitingRejectors.add(rejectForEncoderError);
        const error = callbackError();
        if (error) rejectForEncoderError(error);
        else onDequeue();
    });
}

function resetCanvasTransform(context: CanvasRenderingContext2D): void {
    if (typeof context.resetTransform === 'function') context.resetTransform();
    else context.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Mirrors the v1.44.2 CanvasSink target-case geometry without reusing its private
 * APIs: a 90° rotation is baked into a reused portrait canvas before encoding.
 */
export function drawLegacyLikeCanvasFrame(
    context: CanvasRenderingContext2D,
    sourceFrame: LegacyLikeCanvasPipelineBenchmarkFrameLike,
    rotation: number,
): void {
    const { width: targetWidth, height: targetHeight } = REAL_VIDEO_PIPELINE_BENCHMARK_TARGET;
    if (!sourceFrame.displayWidth || !sourceFrame.displayHeight) {
        throw new Error('Source VideoFrame has no drawable dimensions.');
    }

    resetCanvasTransform(context);
    context.clearRect(0, 0, targetWidth, targetHeight);
    context.save();
    const rotationInRadians = rotation * Math.PI / 180;
    const aspectRatioChange = rotation % 180 === 0 ? 1 : targetWidth / targetHeight;
    context.translate(targetWidth / 2, targetHeight / 2);
    context.rotate(rotationInRadians);
    context.scale(1 / aspectRatioChange, aspectRatioChange);
    context.translate(-targetWidth / 2, -targetHeight / 2);
    context.drawImage(
        sourceFrame as unknown as CanvasImageSource,
        0,
        0,
        sourceFrame.displayWidth,
        sourceFrame.displayHeight,
        0,
        0,
        targetWidth,
        targetHeight,
    );
    context.restore();
}

function classifyFailure(
    error: unknown,
    phase: 'setup' | 'source-frame' | 'canvas-draw' | 'encode' | 'flush',
    signal: AbortSignal | undefined,
): LegacyLikeCanvasPipelineBenchmarkFailureStage {
    if (signal?.aborted || error instanceof LegacyLikeCanvasPipelineBenchmarkAbortError) return 'aborted';
    if (phase === 'source-frame') return 'source-frame-failure';
    if (phase === 'canvas-draw') return 'canvas-draw-failure';
    if (phase === 'encode') return 'encode-failure';
    if (phase === 'flush') return 'flush-failure';
    return 'setup-failure';
}

/**
 * Runs a diagnostic-only, legacy-like HTMLCanvas path for the portrait MOV case.
 * It uses only current MediaBunny public APIs and deliberately never calls
 * VideoSample.transform(), Conversion, muxing, audio, or file output.
 */
export async function runLegacyLikeCanvasPipelineBenchmark(
    file: File,
    options: LegacyLikeCanvasPipelineBenchmarkOptions = {},
): Promise<LegacyLikeCanvasPipelineBenchmarkResult> {
    const now = options.now ?? (() => performance.now());
    const result = createResult(file);
    const createInput = options.createInput ?? createProductionInput;
    const createVideoSampleSink = options.createVideoSampleSink ?? createProductionVideoSampleSink;
    const createCanvas = options.createCanvas ?? createProductionCanvas;
    const createOutputVideoFrame = options.createOutputVideoFrame ?? createProductionOutputVideoFrame;
    const VideoEncoderConstructor = options.VideoEncoder === undefined
        ? (globalThis.VideoEncoder as unknown as RealVideoPipelineBenchmarkEncoderConstructor | undefined)
        : options.VideoEncoder ?? undefined;
    let input: RealVideoPipelineBenchmarkInputLike | undefined;
    let inputDisposed = false;
    let encoder: LegacyLikeCanvasPipelineBenchmarkEncoder | undefined;
    let callbackError: unknown;
    let phase: 'setup' | 'source-frame' | 'canvas-draw' | 'encode' | 'flush' = 'setup';
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
        rejectWaiters(new LegacyLikeCanvasPipelineBenchmarkAbortError());
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
        if (!support.supported) {
            result.capabilities.avcEncode = false;
            result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'config-unsupported', message: 'VideoEncoder does not support the fixed AVC configuration.' };
            return result;
        }
        result.capabilities.avcEncode = true;

        const canvas = createCanvas();
        if (!canvas) {
            result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'canvas-unavailable', message: 'HTMLCanvasElement is unavailable.' };
            return result;
        }
        canvas.width = REAL_VIDEO_PIPELINE_BENCHMARK_TARGET.width;
        canvas.height = REAL_VIDEO_PIPELINE_BENCHMARK_TARGET.height;
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) {
            result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'canvas-context-unavailable', message: 'Canvas 2D context is unavailable.' };
            return result;
        }
        result.timings.inputTrackSetup = Math.max(0, now() - setupStartedAt);

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
        }) as unknown as LegacyLikeCanvasPipelineBenchmarkEncoder;
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
                const normalizedTimestamp = Math.max(sample.timestamp - firstTimestamp, 0);
                sample.setTimestamp(normalizedTimestamp);
                phase = 'source-frame';
                const sourceFrameStartedAt = now();
                const sourceFrame = sample.toVideoFrame();
                result.timings.sourceVideoFrameAcquisition += Math.max(0, now() - sourceFrameStartedAt);
                try {
                    phase = 'canvas-draw';
                    const canvasDrawStartedAt = now();
                    drawLegacyLikeCanvasFrame(context, sourceFrame, rotation);
                    result.timings.canvasDrawRotationResize += Math.max(0, now() - canvasDrawStartedAt);
                    const outputFrameStartedAt = now();
                    const outputFrame = createOutputVideoFrame(canvas, {
                        timestamp: Math.round(normalizedTimestamp * 1_000_000),
                        duration: Math.round(sample.duration * 1_000_000),
                    });
                    result.timings.outputVideoFrameCreation += Math.max(0, now() - outputFrameStartedAt);
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
                        const keyFrameInterval = Math.floor(normalizedTimestamp / REAL_VIDEO_PIPELINE_KEY_FRAME_INTERVAL);
                        const keyFrame = keyFrameInterval !== lastKeyFrameInterval;
                        lastKeyFrameInterval = keyFrameInterval;
                        encoder.encode(outputFrame, { keyFrame });
                        result.timings.encodeSubmissionSync += Math.max(0, now() - encodeStartedAt);
                        result.framesSubmitted += 1;
                        result.maxQueueSize = Math.max(result.maxQueueSize, encoder.encodeQueueSize);
                        if (callbackError) throw callbackError;
                    } finally {
                        outputFrame.close();
                    }
                } finally {
                    sourceFrame.close();
                }
            } catch (error) {
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
        rejectWaiters(new LegacyLikeCanvasPipelineBenchmarkAbortError());
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
