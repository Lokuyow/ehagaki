import type { RawVideoEncoderBenchmarkResult } from './rawVideoEncoderBenchmark';
import type { VideoDecodeBenchmarkResult } from './videoDecodeBenchmark';

export type AacCustomEncoderState = 'not-loaded' | 'loading' | 'registered' | 'failed';

export type AudioPath = 'native-aac' | 'custom-aac' | 'packet-copy' | 'unavailable' | 'unknown';

export type MediaCompressionAudioDiagnosticMode = 'normal' | 'force-packet-copy';

export type MediaCompressionAudioEncodingMode = 'quality' | 'bitrate' | 'default' | 'packet-copy';

export type MediaCompressionVideoDiagnosticMode = 'default-quality' | 'realtime';

export type MediaCompressionVideoRateControlMode = 'subjective-quality' | 'explicit-bitrate';

export interface AudioPathClassification {
    path: AudioPath;
    reason?: string;
}

/**
 * Classifies the public AAC decision points without inspecting MediaBunny internals.
 * A custom encoder registered before this conversion is known to win over native AAC
 * for a matching configuration in MediaBunny 1.55.1.
 */
export function classifyMediaCompressionAudioPath(params: {
    decodeAvailable: boolean;
    stateAtStart: AacCustomEncoderState;
    capabilityBeforeSelection: boolean;
    capabilityAfterRegistration?: boolean;
    registrationSucceeded?: boolean;
}): AudioPathClassification {
    if (!params.decodeAvailable) return { path: 'packet-copy', reason: 'decode-unavailable' };
    if (params.stateAtStart === 'not-loaded' && params.capabilityBeforeSelection) {
        return { path: 'native-aac' };
    }
    if (
        params.stateAtStart === 'not-loaded'
        && !params.capabilityBeforeSelection
        && params.registrationSucceeded === true
        && params.capabilityAfterRegistration === true
    ) {
        return { path: 'custom-aac' };
    }
    if (params.stateAtStart === 'registered' && params.capabilityBeforeSelection) {
        return { path: 'custom-aac' };
    }
    if (params.capabilityAfterRegistration === false || !params.capabilityBeforeSelection) {
        return { path: 'packet-copy', reason: 'aac-encode-unavailable' };
    }
    return { path: 'unknown' };
}

export type MediaCompressionTimingKey =
    | 'input / track inspection'
    | 'video option construction'
    | 'video capability'
    | 'audio preparation'
    | 'aac custom load/register'
    | 'input video stats scan'
    | 'conversion.init'
    | 'conversion.execute'
    | 'compressed File creation'
    | 'output audio preservation verification'
    | 'output video stats scan'
    | 'diagnostic total'
    | 'total compression';

export interface MediaCompressionEnvironment {
    userAgent: string;
    platform: string;
    userAgentData?: {
        brands: string[];
        mobile: boolean;
        platform: string;
    };
    VideoEncoder: 'available' | 'unavailable';
    VideoDecoder: 'available' | 'unavailable';
    AudioEncoder: 'available' | 'unavailable';
    AudioDecoder: 'available' | 'unavailable';
}

export interface MediaCompressionVideoDiagnostic {
    codec?: string | null;
    displayWidth?: number;
    displayHeight?: number;
    decode?: boolean;
    targetWidth?: number;
    targetHeight?: number;
    compressionLevel?: string;
    quality?: string;
    configuredBitrate?: number;
    bitrateMode?: 'constant' | 'variable';
    avcEncode?: boolean;
    inputPacketStats?: MediaCompressionVideoPacketStats | null;
    outputPacketStats?: MediaCompressionVideoPacketStats | null;
}

export interface MediaCompressionVideoPacketStats {
    packetCount: number;
    averagePacketRate: number;
    averageBitrate: number;
    duration?: number | null;
}

export interface MediaCompressionAudioDiagnostic {
    codec?: string | null;
    sourceSampleRate?: number;
    sourceChannels?: number;
    decode?: boolean;
    targetSampleRate?: number;
    targetChannels?: number;
    configuredBitrate?: number | null;
    quality?: string;
    effectiveEncodingMode?: MediaCompressionAudioEncodingMode;
    nativeCapabilityBeforeRegistration?: boolean;
    capabilityBeforeSelection?: boolean;
    capabilityAfterRegistration?: boolean;
    customImport?: 'yes' | 'no' | 'already registered' | 'already loading' | 'failed' | 'unknown';
    customRegistration?: 'not-needed' | 'success' | 'failure' | 'unknown';
    audioPath?: AudioPath;
    reason?: string;
    outputCodec?: string | null;
    outputSampleRate?: number;
    outputChannels?: number;
}

export interface MediaCompressionDiagnosticRecord {
    conversionId: number;
    audioDiagnosticMode: MediaCompressionAudioDiagnosticMode;
    videoDiagnosticMode: MediaCompressionVideoDiagnosticMode;
    videoRateControlMode: MediaCompressionVideoRateControlMode;
    input: {
        mime: string;
        size: number;
        duration?: number | null;
    };
    tracks: {
        videoCount: number;
        audioCount: number;
    };
    video: MediaCompressionVideoDiagnostic[];
    audio: MediaCompressionAudioDiagnostic[];
    aac: {
        stateAtStart: AacCustomEncoderState;
        loadRegisterDuration?: number;
    };
    conversion: {
        isValid?: boolean;
        discardedTracks: Array<{ type: 'video' | 'audio' | 'other'; reason?: string }>;
        discardedVideoCount: number;
        discardedAudioCount: number;
        execute?: 'success' | 'failure';
        aborted?: boolean;
        fallback?: boolean;
        fallbackReason?: string;
    };
    result: {
        outputSize?: number;
        wasCompressed?: boolean;
        wasSkipped?: boolean;
        outputAudioPreserved?: boolean;
    };
    timing: Partial<Record<MediaCompressionTimingKey, number>>;
    error?: {
        name: string;
        message: string;
    };
}

type DiagnosticListener = () => void;

const records: MediaCompressionDiagnosticRecord[] = [];
const rawVideoEncoderBenchmarkRecords: RawVideoEncoderBenchmarkResult[] = [];
const videoDecodeBenchmarkRecords: VideoDecodeBenchmarkResult[] = [];
const listeners = new Set<DiagnosticListener>();
let conversionSequence = 0;
let aacCustomEncoderState: AacCustomEncoderState = 'not-loaded';
let environment: MediaCompressionEnvironment | null = null;

function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}

export function isMediaCompressionDebugEnabled(search?: string): boolean {
    const locationSearch = search ?? (isBrowser() ? window.location.search : '');
    return new URLSearchParams(locationSearch).get('media-debug') === '1';
}

export function isMediaCompressionDebugAudioCopyEnabled(search?: string): boolean {
    const locationSearch = search ?? (isBrowser() ? window.location.search : '');
    const params = new URLSearchParams(locationSearch);
    return params.get('media-debug') === '1' && params.get('media-debug-audio') === 'copy';
}

export function isMediaCompressionDebugVideoRealtimeEnabled(search?: string): boolean {
    const locationSearch = search ?? (isBrowser() ? window.location.search : '');
    const params = new URLSearchParams(locationSearch);
    return params.get('media-debug') === '1'
        && params.get('media-debug-audio') === 'copy'
        && params.get('media-debug-video-latency') === 'realtime';
}

export function isMediaCompressionDebugVideoBitrateEnabled(search?: string): boolean {
    const locationSearch = search ?? (isBrowser() ? window.location.search : '');
    const params = new URLSearchParams(locationSearch);
    return params.get('media-debug') === '1'
        && params.get('media-debug-audio') === 'copy'
        && params.get('media-debug-video-rate-control') === 'bitrate';
}

export function getMediaCompressionVideoRateControlMode(search?: string): MediaCompressionVideoRateControlMode {
    return isMediaCompressionDebugVideoBitrateEnabled(search) ? 'explicit-bitrate' : 'subjective-quality';
}

export function isMediaCompressionDebugRawVideoEncoderEnabled(search?: string): boolean {
    const locationSearch = search ?? (isBrowser() ? window.location.search : '');
    const params = new URLSearchParams(locationSearch);
    return params.get('media-debug') === '1' && params.get('media-debug-raw-video-encoder') === '1';
}

export function isMediaCompressionDebugVideoDecodeBenchmarkEnabled(search?: string): boolean {
    const locationSearch = search ?? (isBrowser() ? window.location.search : '');
    const params = new URLSearchParams(locationSearch);
    return params.get('media-debug') === '1' && params.get('media-debug-video-decode-benchmark') === '1';
}

export function getMediaCompressionVideoDiagnosticMode(search?: string): MediaCompressionVideoDiagnosticMode {
    return isMediaCompressionDebugVideoRealtimeEnabled(search) ? 'realtime' : 'default-quality';
}

export function getMediaCompressionAudioDiagnosticMode(search?: string): MediaCompressionAudioDiagnosticMode {
    return isMediaCompressionDebugAudioCopyEnabled(search) ? 'force-packet-copy' : 'normal';
}

function notify(): void {
    for (const listener of listeners) {
        listener();
    }
}

function readEnvironment(): MediaCompressionEnvironment | null {
    if (!isBrowser() || !isMediaCompressionDebugEnabled()) return null;

    const userAgentData = 'userAgentData' in navigator
        ? (navigator as Navigator & {
            userAgentData?: {
                brands?: Array<{ brand: string; version: string }>;
                mobile?: boolean;
                platform?: string;
            };
        }).userAgentData
        : undefined;

    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        ...(userAgentData
            ? {
                userAgentData: {
                    brands: (userAgentData.brands ?? []).map(({ brand, version }) => `${brand} ${version}`),
                    mobile: userAgentData.mobile === true,
                    platform: userAgentData.platform ?? '',
                },
            }
            : {}),
        VideoEncoder: typeof globalThis.VideoEncoder === 'function' ? 'available' : 'unavailable',
        VideoDecoder: typeof globalThis.VideoDecoder === 'function' ? 'available' : 'unavailable',
        AudioEncoder: typeof globalThis.AudioEncoder === 'function' ? 'available' : 'unavailable',
        AudioDecoder: typeof globalThis.AudioDecoder === 'function' ? 'available' : 'unavailable',
    };
}

export function getMediaCompressionEnvironment(): MediaCompressionEnvironment | null {
    if (!environment && isMediaCompressionDebugEnabled()) {
        environment = readEnvironment();
    }
    return environment;
}

export function getAacCustomEncoderState(): AacCustomEncoderState {
    return aacCustomEncoderState;
}

export function setAacCustomEncoderState(state: AacCustomEncoderState): void {
    aacCustomEncoderState = state;
    if (isMediaCompressionDebugEnabled()) notify();
}

export function getMediaCompressionDiagnosticRecords(): MediaCompressionDiagnosticRecord[] {
    return records;
}

export function getRawVideoEncoderBenchmarkRecords(): RawVideoEncoderBenchmarkResult[] {
    return rawVideoEncoderBenchmarkRecords;
}

export function getVideoDecodeBenchmarkRecords(): VideoDecodeBenchmarkResult[] {
    return videoDecodeBenchmarkRecords;
}

export function addRawVideoEncoderBenchmarkRecord(result: RawVideoEncoderBenchmarkResult): void {
    rawVideoEncoderBenchmarkRecords.push(result);
    notify();
}

export function addVideoDecodeBenchmarkRecord(result: VideoDecodeBenchmarkResult): void {
    videoDecodeBenchmarkRecords.push(result);
    notify();
}

export function subscribeToMediaCompressionDiagnostics(listener: DiagnosticListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function clearMediaCompressionDiagnosticRecords(): void {
    records.length = 0;
    rawVideoEncoderBenchmarkRecords.length = 0;
    videoDecodeBenchmarkRecords.length = 0;
    notify();
}

function now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function durationSince(start: number): number {
    return Math.max(0, now() - start);
}

function ensureVideo(record: MediaCompressionDiagnosticRecord, index: number): MediaCompressionVideoDiagnostic {
    record.video[index] ??= {};
    return record.video[index];
}

function ensureAudio(record: MediaCompressionDiagnosticRecord, index: number): MediaCompressionAudioDiagnostic {
    record.audio[index] ??= {};
    return record.audio[index];
}

function shortErrorMessage(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    return message.replace(/[\r\n]+/g, ' ').slice(0, 240);
}

export interface MediaCompressionDiagnosticSession {
    readonly conversionId: number;
    setInputDuration(duration: number | null): void;
    setTrackCounts(videoCount: number, audioCount: number): void;
    setVideo(index: number, value: Partial<MediaCompressionVideoDiagnostic>): void;
    setAudio(index: number, value: Partial<MediaCompressionAudioDiagnostic>): void;
    setAac(value: Partial<MediaCompressionDiagnosticRecord['aac']>): void;
    setTiming(key: MediaCompressionTimingKey, duration: number): void;
    setConversion(value: Partial<MediaCompressionDiagnosticRecord['conversion']>): void;
    setResult(value: Partial<MediaCompressionDiagnosticRecord['result']>): void;
    setError(error: unknown): void;
    measureDiagnosticScan<T>(key: 'input video stats scan' | 'output video stats scan', task: () => Promise<T>): Promise<T>;
    finish(result: { file: File; wasCompressed: boolean; wasSkipped?: boolean; aborted?: boolean }): void;
}

class DiagnosticSession implements MediaCompressionDiagnosticSession {
    private diagnosticOverhead = 0;

    constructor(private record: MediaCompressionDiagnosticRecord, private startedAt: number) { }

    get conversionId(): number {
        return this.record.conversionId;
    }

    setInputDuration(duration: number | null): void {
        this.record.input.duration = duration;
        notify();
    }

    setTrackCounts(videoCount: number, audioCount: number): void {
        this.record.tracks = { videoCount, audioCount };
        notify();
    }

    setVideo(index: number, value: Partial<MediaCompressionVideoDiagnostic>): void {
        Object.assign(ensureVideo(this.record, index), value);
        notify();
    }

    setAudio(index: number, value: Partial<MediaCompressionAudioDiagnostic>): void {
        Object.assign(ensureAudio(this.record, index), value);
        notify();
    }

    setAac(value: Partial<MediaCompressionDiagnosticRecord['aac']>): void {
        Object.assign(this.record.aac, value);
        notify();
    }

    setTiming(key: MediaCompressionTimingKey, duration: number): void {
        this.record.timing[key] = Math.max(0, duration);
        notify();
    }

    setConversion(value: Partial<MediaCompressionDiagnosticRecord['conversion']>): void {
        Object.assign(this.record.conversion, value);
        notify();
    }

    setResult(value: Partial<MediaCompressionDiagnosticRecord['result']>): void {
        Object.assign(this.record.result, value);
        notify();
    }

    setError(error: unknown): void {
        this.record.error = {
            name: error instanceof Error && error.name ? error.name : 'Error',
            message: shortErrorMessage(error),
        };
        notify();
    }

    async measureDiagnosticScan<T>(
        key: 'input video stats scan' | 'output video stats scan',
        task: () => Promise<T>,
    ): Promise<T> {
        const startedAt = now();
        try {
            return await task();
        } finally {
            const duration = durationSince(startedAt);
            this.diagnosticOverhead += duration;
            this.setTiming(key, duration);
        }
    }

    finish(result: { file: File; wasCompressed: boolean; wasSkipped?: boolean; aborted?: boolean }): void {
        this.setResult({
            outputSize: result.file.size,
            wasCompressed: result.wasCompressed,
            wasSkipped: result.wasSkipped ?? false,
        });
        this.setConversion({ aborted: result.aborted ?? false });
        this.setTiming('diagnostic total', durationSince(this.startedAt));
        this.setTiming('total compression', Math.max(0, durationSince(this.startedAt) - this.diagnosticOverhead));
    }
}

export function startMediaCompressionDiagnostic(file: File): MediaCompressionDiagnosticSession | null {
    if (!isMediaCompressionDebugEnabled()) return null;

    environment ??= readEnvironment();
    const record: MediaCompressionDiagnosticRecord = {
        conversionId: ++conversionSequence,
        audioDiagnosticMode: getMediaCompressionAudioDiagnosticMode(),
        videoDiagnosticMode: getMediaCompressionVideoDiagnosticMode(),
        videoRateControlMode: getMediaCompressionVideoRateControlMode(),
        input: { mime: file.type || 'unknown', size: file.size },
        tracks: { videoCount: 0, audioCount: 0 },
        video: [],
        audio: [],
        aac: { stateAtStart: aacCustomEncoderState },
        conversion: {
            discardedTracks: [],
            discardedVideoCount: 0,
            discardedAudioCount: 0,
        },
        result: {},
        timing: {},
    };
    records.push(record);
    notify();
    return new DiagnosticSession(record, now());
}

function formatValue(value: unknown): string {
    if (value === undefined || value === null || value === '') return 'unknown';
    return String(value);
}

function formatBoolean(value: boolean | undefined): string {
    return value === undefined ? 'unknown' : String(value);
}

function formatDuration(value: number | undefined): string {
    return value === undefined ? 'not recorded' : `${value.toFixed(1)} ms`;
}

function formatEnvironment(value: MediaCompressionEnvironment | null): string[] {
    if (!value) return ['Environment', 'not recorded'];

    return [
        'Environment',
        `userAgent: ${value.userAgent}`,
        `platform: ${value.platform}`,
        ...(value.userAgentData
            ? [
                `userAgentData.platform: ${value.userAgentData.platform || 'unknown'}`,
                `userAgentData.mobile: ${value.userAgentData.mobile}`,
                `userAgentData.brands: ${value.userAgentData.brands.join(', ') || 'unknown'}`,
            ]
            : []),
        `VideoEncoder: ${value.VideoEncoder}`,
        `VideoDecoder: ${value.VideoDecoder}`,
        `AudioEncoder: ${value.AudioEncoder}`,
        `AudioDecoder: ${value.AudioDecoder}`,
        `AAC custom state: ${aacCustomEncoderState}`,
    ];
}

function formatRawVideoEncoderBenchmark(record: RawVideoEncoderBenchmarkResult, index: number): string[] {
    const lines = [
        `Raw VideoEncoder Benchmark #${index + 1}`,
        `status: ${record.status}`,
        `canvas/source kind: ${record.canvasSource}`,
        `source: ${record.source}`,
        'config',
        `codec: ${record.config.codec}`,
        `size: ${record.config.width}x${record.config.height}`,
        `framerate: ${record.config.framerate}`,
        `bitrate: ${record.config.bitrate} bps`,
        'latencyMode: omitted/default',
        'hardwareAcceleration: omitted/default',
        'bitrateMode: omitted/default',
        `frames requested: ${record.frameCount}`,
        `queue limit: ${record.queueLimit}`,
        `max queue size: ${record.maxQueueSize}`,
        `frames submitted: ${record.framesSubmitted}`,
        `encoded chunks: ${record.chunks}`,
        `encoded bytes: ${record.bytes}`,
        `key chunks: ${record.keyChunks}`,
        `delta chunks: ${record.deltaChunks}`,
        `throughput: ${record.throughput === undefined ? 'not recorded' : `${record.throughput.toFixed(2)} fps`}`,
        'Timing (overlaps; do not sum)',
        `config support check: ${formatDuration(record.timings.configSupportCheck)}`,
        `encoder setup/configure: ${formatDuration(record.timings.encoderSetupConfigure)}`,
        `benchmark wall: ${formatDuration(record.timings.benchmarkWall)}`,
        `frame preparation sync: ${formatDuration(record.timings.framePreparationSync)}`,
        `encode() submission sync: ${formatDuration(record.timings.encodeSubmissionSync)}`,
        `backpressure wait: ${formatDuration(record.timings.backpressureWait)}`,
        `flush wait: ${formatDuration(record.timings.flushWait)}`,
    ];
    if (record.failure) {
        lines.push(`failure: ${record.failure.stage}: ${record.failure.message}`);
    }
    lines.push('No MediaBunny, audio, muxing, Blob, or file output is used by this benchmark.', '');
    return lines;
}

function formatDecodeOffset(value: number | undefined | null): string {
    return value === undefined || value === null ? 'not reached' : `+${value.toFixed(1)} ms`;
}

function formatVideoDecodeBenchmark(record: VideoDecodeBenchmarkResult, index: number): string[] {
    const firstSample = record.decode.firstSample;
    const lines = [
        `Video Decode Benchmark #${index + 1}`,
        `status: ${record.status}`,
        'Input',
        `mime: ${record.input.mime}`,
        `size: ${record.input.size} bytes`,
        `duration: ${record.input.duration === null ? 'unknown' : `${record.input.duration.toFixed(3)} s`}`,
        `video codec: ${formatValue(record.input.videoCodec)}`,
        `source size: ${record.input.displayWidth === null || record.input.displayHeight === null
            ? 'unknown'
            : `${record.input.displayWidth}x${record.input.displayHeight}`}`,
        'Decode',
        `samples decoded: ${record.decode.samplesDecoded}`,
        `first sample format: ${formatValue(firstSample?.format)}`,
        `first sample size: ${firstSample ? `${firstSample.codedWidth}x${firstSample.codedHeight} coded / ${firstSample.displayWidth}x${firstSample.displayHeight} display` : 'not recorded'}`,
        `sample #1: ${formatDecodeOffset(record.decode.milestoneOffsets[1])}`,
        `sample #100: ${formatDecodeOffset(record.decode.milestoneOffsets[100])}`,
        `sample #300: ${formatDecodeOffset(record.decode.milestoneOffsets[300])}`,
        `sample #500: ${formatDecodeOffset(record.decode.milestoneOffsets[500])}`,
        `sample #627: ${formatDecodeOffset(record.decode.milestoneOffsets[627])}`,
        `last sample: ${formatDecodeOffset(record.decode.lastSampleOffset)}`,
        'Timing',
        `input / track setup: ${formatDuration(record.timing.inputTrackSetup)}`,
        `decode wall: ${formatDuration(record.timing.decodeWall)}`,
        `throughput: ${record.timing.throughput === null ? 'not recorded' : `${record.timing.throughput.toFixed(2)} fps`}`,
    ];
    if (record.failure) {
        lines.push(`failure: ${record.failure.stage}: ${record.failure.message}`);
    }
    lines.push('No resize, video encode, audio, muxing, or file output is performed by this benchmark.', '');
    return lines;
}

export function formatMediaCompressionDiagnostics(): string {
    const lines = [
        'Media Compression Debug',
        'Keep this data on the device. It is not sent to a server.',
        `Diagnostic A/B mode: ${getMediaCompressionAudioDiagnosticMode() === 'force-packet-copy'
            ? 'Forced audio packet copy'
            : 'Normal audio transcode'}`,
        ...(getMediaCompressionAudioDiagnosticMode() === 'force-packet-copy'
            ? ['Diagnostic A/B mode: audio is being packet-copied instead of transcoded.']
            : []),
        `Video latency: ${getMediaCompressionVideoDiagnosticMode() === 'realtime' ? 'realtime' : 'quality (default)'}`,
        `Video rate control: ${getMediaCompressionVideoRateControlMode()}`,
        `Raw native VideoEncoder benchmark: ${isMediaCompressionDebugRawVideoEncoderEnabled() ? 'enabled (manual run)' : 'disabled'}`,
        `Video decode benchmark: ${isMediaCompressionDebugVideoDecodeBenchmarkEnabled() ? 'enabled (manual run)' : 'disabled'}`,
        ...formatEnvironment(getMediaCompressionEnvironment()),
        '',
    ];

    if (records.length === 0) {
        lines.push('No conversions recorded.');
    }

    for (const record of records) {
        lines.push(`Conversion #${record.conversionId}`);
        lines.push(`audio diagnostic mode: ${record.audioDiagnosticMode}`);
        lines.push(`video diagnostic mode: ${record.videoDiagnosticMode}`);
        lines.push(`video rate control: ${record.videoRateControlMode}`);
        lines.push(`video latency mode: ${record.videoDiagnosticMode === 'realtime' ? 'realtime' : 'quality (MediaBunny default)'}`);
        lines.push('Input');
        lines.push(`mime: ${formatValue(record.input.mime)}`);
        lines.push(`size: ${record.input.size} bytes`);
        lines.push(`duration: ${record.input.duration === undefined ? 'not recorded' : `${formatValue(record.input.duration)} s`}`);
        lines.push(`video tracks: ${record.tracks.videoCount}`);
        lines.push(`audio tracks: ${record.tracks.audioCount}`);
        lines.push(`AAC custom state at start: ${record.aac.stateAtStart}`);

        record.video.forEach((video, index) => {
            lines.push(`Video #${index + 1}`);
            lines.push(`codec: ${formatValue(video.codec)}`);
            lines.push(`source: ${formatValue(video.displayWidth)}x${formatValue(video.displayHeight)}`);
            lines.push(`target: ${formatValue(video.targetWidth)}x${formatValue(video.targetHeight)}`);
            lines.push(`decode: ${formatBoolean(video.decode)}`);
            lines.push(`AVC encode: ${formatBoolean(video.avcEncode)}`);
            lines.push(`compression level: ${formatValue(video.compressionLevel)}`);
            lines.push(`MediaBunny video Quality: ${formatValue(video.quality)}`);
            if (video.configuredBitrate !== undefined) {
                lines.push(`configured video bitrate: ${video.configuredBitrate} bps`);
            }
            if (video.bitrateMode !== undefined) {
                lines.push(`bitrate mode: ${video.bitrateMode}`);
            }
            if (video.inputPacketStats) {
                lines.push(`input frames: ${video.inputPacketStats.packetCount}`);
                lines.push(`input FPS: ${video.inputPacketStats.averagePacketRate.toFixed(2)}`);
                lines.push(`input bitrate: ${video.inputPacketStats.averageBitrate} bps`);
                lines.push(`input duration: ${formatValue(video.inputPacketStats.duration)} s`);
            } else {
                lines.push('input packet stats: not recorded');
            }
            if (video.outputPacketStats) {
                lines.push(`output frames: ${video.outputPacketStats.packetCount}`);
                lines.push(`output FPS: ${video.outputPacketStats.averagePacketRate.toFixed(2)}`);
                lines.push(`output bitrate: ${video.outputPacketStats.averageBitrate} bps`);
                lines.push(`output duration: ${formatValue(video.outputPacketStats.duration)} s`);
            } else {
                lines.push('output packet stats: not recorded');
            }
        });

        record.audio.forEach((audio, index) => {
            lines.push(`Audio #${index + 1}`);
            lines.push(`codec: ${formatValue(audio.codec)}`);
            lines.push(`source: ${formatValue(audio.sourceSampleRate)} Hz / ${formatValue(audio.sourceChannels)}ch`);
            lines.push(`${record.audioDiagnosticMode === 'force-packet-copy' ? 'normal target' : 'target'}: ${formatValue(audio.targetSampleRate)} Hz / ${formatValue(audio.targetChannels)}ch`);
            lines.push(`decode: ${formatBoolean(audio.decode)}`);
            lines.push(`effective audio encoding mode: ${formatValue(audio.effectiveEncodingMode)}`);
            lines.push(`configured audio bitrate: ${formatValue(audio.configuredBitrate)}`);
            lines.push(`MediaBunny audio Quality: ${formatValue(audio.quality)}`);
            lines.push(`native AAC before registration: ${formatBoolean(audio.nativeCapabilityBeforeRegistration)}`);
            lines.push(`AAC capability before selection: ${formatBoolean(audio.capabilityBeforeSelection)}`);
            lines.push(`custom import: ${formatValue(audio.customImport)}`);
            lines.push(`custom registration: ${formatValue(audio.customRegistration)}`);
            lines.push(`AAC after registration: ${formatBoolean(audio.capabilityAfterRegistration)}`);
            lines.push(`audio path: ${formatValue(audio.audioPath)}`);
            if (audio.reason) lines.push(`reason: ${audio.reason}`);
            lines.push(`output codec: ${formatValue(audio.outputCodec)}`);
            lines.push(`output audio: ${formatValue(audio.outputSampleRate)} Hz / ${formatValue(audio.outputChannels)}ch`);
        });

        lines.push('Conversion');
        lines.push(`isValid: ${formatBoolean(record.conversion.isValid)}`);
        lines.push(`discarded tracks: ${record.conversion.discardedTracks.length}`);
        lines.push(`discarded video: ${record.conversion.discardedVideoCount}`);
        lines.push(`discarded audio: ${record.conversion.discardedAudioCount}`);
        lines.push(`execute: ${formatValue(record.conversion.execute)}`);
        lines.push(`aborted: ${formatBoolean(record.conversion.aborted)}`);
        lines.push(`original fallback: ${formatBoolean(record.conversion.fallback)}`);
        lines.push(`fallback reason: ${formatValue(record.conversion.fallbackReason)}`);
        if (record.error) {
            lines.push(`error: ${record.error.name}: ${record.error.message}`);
        }

        lines.push('Timing');
        for (const key of [
            'input / track inspection',
            'video option construction',
            'video capability',
            'audio preparation',
            'aac custom load/register',
            'input video stats scan',
            'conversion.init',
            'conversion.execute',
            'compressed File creation',
            'output audio preservation verification',
            'output video stats scan',
            'diagnostic total',
            'total compression',
        ] as const) {
            lines.push(`${key}: ${formatDuration(record.timing[key])}`);
        }

        lines.push('Result');
        lines.push(`wasCompressed: ${formatBoolean(record.result.wasCompressed)}`);
        lines.push(`wasSkipped: ${formatBoolean(record.result.wasSkipped)}`);
        lines.push(`output size: ${formatValue(record.result.outputSize)} bytes`);
        lines.push(`output audio preserved: ${formatBoolean(record.result.outputAudioPreserved)}`);
        lines.push('');
    }

    rawVideoEncoderBenchmarkRecords.forEach((record, index) => {
        lines.push(...formatRawVideoEncoderBenchmark(record, index));
    });

    videoDecodeBenchmarkRecords.forEach((record, index) => {
        lines.push(...formatVideoDecodeBenchmark(record, index));
    });

    lines.push('Reload the page before Conversion #1 to test AAC capability before the custom encoder is registered.');
    return lines.join('\n');
}
