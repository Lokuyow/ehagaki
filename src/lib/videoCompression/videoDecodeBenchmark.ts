import {
    ALL_FORMATS,
    BlobSource,
    Input,
    VideoSampleSink,
} from 'mediabunny';

export const VIDEO_DECODE_BENCHMARK_MILESTONES = [1, 100, 300, 500, 627] as const;

export type VideoDecodeBenchmarkFailureStage =
    | 'no-video-track'
    | 'decoder-unavailable'
    | 'decode-failure'
    | 'setup-failure'
    | 'aborted';

export interface VideoDecodeBenchmarkSampleMetadata {
    format: string | null;
    codedWidth: number;
    codedHeight: number;
    displayWidth: number;
    displayHeight: number;
}

export interface VideoDecodeBenchmarkResult {
    status: 'completed' | 'failed';
    input: {
        mime: string;
        size: number;
        duration: number | null;
        videoCodec: string | null;
        displayWidth: number | null;
        displayHeight: number | null;
    };
    decode: {
        samplesDecoded: number;
        firstSample: VideoDecodeBenchmarkSampleMetadata | null;
        milestoneOffsets: Partial<Record<(typeof VIDEO_DECODE_BENCHMARK_MILESTONES)[number], number>>;
        lastSampleOffset: number | null;
    };
    timing: {
        inputTrackSetup: number;
        decodeWall: number;
        throughput: number | null;
    };
    failure?: {
        stage: VideoDecodeBenchmarkFailureStage;
        message: string;
    };
}

export interface VideoDecodeBenchmarkSampleLike {
    format: string | null;
    codedWidth: number;
    codedHeight: number;
    displayWidth: number;
    displayHeight: number;
    close(): void;
}

export interface VideoDecodeBenchmarkTrackLike {
    canDecode(): Promise<boolean>;
    getCodec(): Promise<string | null>;
    getDisplayWidth(): Promise<number>;
    getDisplayHeight(): Promise<number>;
}

export interface VideoDecodeBenchmarkInputLike {
    getVideoTracks(): Promise<VideoDecodeBenchmarkTrackLike[]>;
    getDurationFromMetadata(): Promise<number | null>;
    dispose(): void;
}

export interface VideoDecodeBenchmarkSinkLike {
    samples(): AsyncIterable<VideoDecodeBenchmarkSampleLike>;
}

export interface VideoDecodeBenchmarkOptions {
    signal?: AbortSignal;
    /** Test-only overrides keep production on MediaBunny's public APIs. */
    now?: () => number;
    createInput?: (file: File) => VideoDecodeBenchmarkInputLike;
    createVideoSampleSink?: (track: VideoDecodeBenchmarkTrackLike) => VideoDecodeBenchmarkSinkLike;
}

class BenchmarkAbortError extends Error {
    constructor() {
        super('Video decode benchmark was aborted.');
        this.name = 'AbortError';
    }
}

function shortErrorMessage(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    return message.replace(/[\r\n]+/g, ' ').slice(0, 240);
}

function createResult(file: File): VideoDecodeBenchmarkResult {
    return {
        status: 'failed',
        input: {
            mime: file.type || 'unknown',
            size: file.size,
            duration: null,
            videoCodec: null,
            displayWidth: null,
            displayHeight: null,
        },
        decode: {
            samplesDecoded: 0,
            firstSample: null,
            milestoneOffsets: {},
            lastSampleOffset: null,
        },
        timing: {
            inputTrackSetup: 0,
            decodeWall: 0,
            throughput: null,
        },
    };
}

function createProductionInput(file: File): VideoDecodeBenchmarkInputLike {
    return new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
}

function createProductionVideoSampleSink(track: VideoDecodeBenchmarkTrackLike): VideoDecodeBenchmarkSinkLike {
    // The default caller receives an InputVideoTrack from Input.getVideoTracks().
    // The structural test seam intentionally exposes only the public track methods.
    return new VideoSampleSink(track as never);
}

function throwIfAborted(signal: AbortSignal | undefined): void {
    if (signal?.aborted) throw new BenchmarkAbortError();
}

/**
 * Decodes one input video track with MediaBunny's public sample API. It deliberately
 * performs no packet-stat scan, resize, encode, audio work, muxing, or file output.
 */
export async function runVideoDecodeBenchmark(
    file: File,
    options: VideoDecodeBenchmarkOptions = {},
): Promise<VideoDecodeBenchmarkResult> {
    const now = options.now ?? (() => performance.now());
    const result = createResult(file);
    const createInput = options.createInput ?? createProductionInput;
    const createVideoSampleSink = options.createVideoSampleSink ?? createProductionVideoSampleSink;
    let input: VideoDecodeBenchmarkInputLike | undefined;
    let inputDisposed = false;
    let phase: 'setup' | 'decode' = 'setup';

    const disposeInput = () => {
        if (!input || inputDisposed) return;
        inputDisposed = true;
        try {
            input.dispose();
        } catch {
            // Abort/cleanup must not turn a completed diagnostic result into a thrown error.
        }
    };
    const abortInput = () => disposeInput();
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

        const track = videoTracks[0];
        if (!track) {
            result.timing.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'no-video-track', message: 'The input has no video track.' };
            return result;
        }

        const [canDecode, videoCodec, displayWidth, displayHeight] = await Promise.all([
            track.canDecode(),
            track.getCodec(),
            track.getDisplayWidth(),
            track.getDisplayHeight(),
        ]);
        throwIfAborted(options.signal);
        result.input.duration = duration;
        result.input.videoCodec = videoCodec;
        result.input.displayWidth = displayWidth;
        result.input.displayHeight = displayHeight;

        if (!canDecode) {
            result.timing.inputTrackSetup = Math.max(0, now() - setupStartedAt);
            result.failure = { stage: 'decoder-unavailable', message: 'This video track cannot be decoded by this browser.' };
            return result;
        }

        const sink = createVideoSampleSink(track);
        result.timing.inputTrackSetup = Math.max(0, now() - setupStartedAt);
        phase = 'decode';
        const decodeStartedAt = now();

        for await (const sample of sink.samples()) {
            try {
                throwIfAborted(options.signal);
                result.decode.samplesDecoded += 1;
                const sampleOffset = Math.max(0, now() - decodeStartedAt);
                result.decode.lastSampleOffset = sampleOffset;
                if (!result.decode.firstSample) {
                    result.decode.firstSample = {
                        format: sample.format,
                        codedWidth: sample.codedWidth,
                        codedHeight: sample.codedHeight,
                        displayWidth: sample.displayWidth,
                        displayHeight: sample.displayHeight,
                    };
                }
                if (VIDEO_DECODE_BENCHMARK_MILESTONES.includes(result.decode.samplesDecoded as never)) {
                    result.decode.milestoneOffsets[result.decode.samplesDecoded as (typeof VIDEO_DECODE_BENCHMARK_MILESTONES)[number]] = sampleOffset;
                }
            } finally {
                sample.close();
            }
        }

        throwIfAborted(options.signal);
        result.timing.decodeWall = Math.max(0, now() - decodeStartedAt);
        result.timing.throughput = result.timing.decodeWall > 0
            ? result.decode.samplesDecoded / (result.timing.decodeWall / 1_000)
            : null;
        result.status = 'completed';
        return result;
    } catch (error) {
        result.failure = {
            stage: options.signal?.aborted || error instanceof BenchmarkAbortError
                ? 'aborted'
                : phase === 'decode' ? 'decode-failure' : 'setup-failure',
            message: shortErrorMessage(error),
        };
        return result;
    } finally {
        options.signal?.removeEventListener('abort', abortInput);
        disposeInput();
    }
}
