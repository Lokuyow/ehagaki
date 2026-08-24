import {
    ALL_FORMATS,
    BlobSource,
    BufferTarget,
    canDecodeAudio,
    canEncodeAudio,
    canEncodeVideo,
    Conversion,
    Input,
    Mp4OutputFormat,
    Output,
    QUALITY_HIGH,
    QUALITY_MEDIUM,
    QUALITY_VERY_LOW,
    type ConversionAudioOptions,
    type ConversionVideoOptions,
    type InputAudioTrack,
    type InputVideoTrack,
    type Quality,
} from 'mediabunny';
import type { VideoCompressionResult } from '../types';
import { isDefaultUploadAborted, type UploadAbortChecker } from '../uploadAbortUtils';
import type {
    EnabledVideoCompressionOptions,
    VideoCompressionQualityPreset,
} from './videoCompressionConfig';

const CONTEXT = 'MediaBunnyCompression';
let aacEncoderRegistration: Promise<void> | null = null;

function devLog(...args: unknown[]): void {
    if (import.meta.env.DEV) console.log(`[${CONTEXT}]`, ...args);
}

function devWarn(...args: unknown[]): void {
    if (import.meta.env.DEV) console.warn(`[${CONTEXT}]`, ...args);
}

function ceilToMultipleOfTwo(value: number): number {
    return Math.ceil(value / 2) * 2;
}

function getMediaBunnyQuality(preset: VideoCompressionQualityPreset): Quality {
    switch (preset) {
        case 'high': return QUALITY_HIGH;
        case 'medium': return QUALITY_MEDIUM;
        case 'low': return QUALITY_VERY_LOW;
    }
}

function createCompressedResult(blob: Blob, originalFile: File): VideoCompressionResult {
    if (blob.size >= originalFile.size) {
        devLog('Compressed file is larger, using original');
        return { file: originalFile, wasCompressed: false };
    }

    const nameWithoutExt = originalFile.name.replace(/\.[^.]+$/, '');
    const file = new File([blob], `${nameWithoutExt}_compressed.mp4`, { type: 'video/mp4' });
    if (import.meta.env.DEV) {
        const ratio = ((1 - file.size / originalFile.size) * 100).toFixed(1);
        devLog('Compression successful:', { originalSize: originalFile.size, compressedSize: file.size, ratio: `${ratio}%` });
    }
    return { file, wasCompressed: true };
}

async function registerAacEncoder(): Promise<void> {
    if (!aacEncoderRegistration) {
        aacEncoderRegistration = import('@mediabunny/aac-encoder').then(({ registerAacEncoder }) => {
            registerAacEncoder();
        });
    }
    await aacEncoderRegistration;
}

export class MediaBunnyCompression {
    private abortController: AbortController | null = null;
    private abortRequested = false;
    private onProgress?: (progress: number) => void;

    constructor(
        private readonly isUploadAborted: UploadAbortChecker = isDefaultUploadAborted,
    ) { }

    public abort(): void {
        this.abortRequested = true;
        this.resetProgress();
        this.abortController?.abort();
    }

    public async cleanup(): Promise<void> {
        this.abortController = null;
    }

    public setProgressCallback(callback?: (progress: number) => void): void {
        this.onProgress = callback;
    }

    private resetProgress(): void {
        this.onProgress?.(0);
    }

    private updateProgress(progress: number): void {
        this.onProgress?.(Math.round(progress));
    }

    private getAbortedResult(file: File): VideoCompressionResult | null {
        if (!this.isUploadAborted()) return null;
        devLog('Compression aborted');
        this.resetProgress();
        return { file, wasCompressed: false, wasSkipped: true, aborted: true };
    }

    private async canTranscodeVideo(track: InputVideoTrack, dimensions: { width: number; height: number }, quality: Quality): Promise<boolean> {
        if (!await track.canDecode()) return false;
        return canEncodeVideo('avc', { ...dimensions, ...{ quality } });
    }

    private async buildAudioOptions(
        track: InputAudioTrack,
        options: EnabledVideoCompressionOptions,
        quality: Quality,
    ): Promise<ConversionAudioOptions> {
        if (!track.codec || !await canDecodeAudio(track.codec)) {
            devLog('Audio decode is unavailable; preserving packets without transcoding.', { codec: track.codec });
            return {};
        }

        const encoderOptions = {
            numberOfChannels: options.audioChannels ?? track.numberOfChannels,
            sampleRate: options.audioSampleRate ?? track.sampleRate,
            bitrate: quality,
        };
        if (!await canEncodeAudio('aac', encoderOptions)) await registerAacEncoder();
        if (!await canEncodeAudio('aac', encoderOptions)) {
            devLog('AAC encoding is unavailable; preserving packets without transcoding.', { codec: track.codec });
            return {};
        }
        return { codec: 'aac', forceTranscode: true, ...encoderOptions };
    }

    private async buildVideoOptions(
        track: InputVideoTrack,
        options: EnabledVideoCompressionOptions,
        quality: Quality,
    ): Promise<{ options: ConversionVideoOptions; dimensions: { width: number; height: number } }> {
        const displayWidth = await track.getDisplayWidth();
        const displayHeight = await track.getDisplayHeight();
        const videoOptions: ConversionVideoOptions = {
            codec: 'avc',
            forceTranscode: true,
            ...{ quality },
        };
        if (displayWidth > displayHeight) {
            videoOptions.width = Math.min(displayWidth, options.maxSize);
        } else {
            videoOptions.height = Math.min(displayHeight, options.maxSize);
        }

        // Keep capability dimensions identical to MediaBunny's one-sided conversion resize.
        let width = displayWidth;
        let height = displayHeight;
        if (videoOptions.width !== undefined) {
            width = ceilToMultipleOfTwo(videoOptions.width);
            height = ceilToMultipleOfTwo(Math.round(width / (displayWidth / displayHeight)));
        } else if (videoOptions.height !== undefined) {
            height = ceilToMultipleOfTwo(videoOptions.height);
            width = ceilToMultipleOfTwo(Math.round(height * (displayWidth / displayHeight)));
        }
        return { options: videoOptions, dimensions: { width, height } };
    }

    private async outputPreservesAudio(file: File, expectedTrackCount: number): Promise<boolean> {
        const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
        try {
            return (await input.getAudioTracks()).length >= expectedTrackCount;
        } finally {
            input.dispose();
        }
    }

    public async compress(file: File, options: EnabledVideoCompressionOptions): Promise<VideoCompressionResult> {
        let input: Input | null = null;
        try {
            this.abortRequested = false;
            this.abortController = new AbortController();
            input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });

            const videoTracks = await input.getVideoTracks();
            const audioTracks = await input.getAudioTracks();
            const quality = getMediaBunnyQuality(options.qualityPreset);
            const videoOptions = videoTracks.length > 0
                ? await this.buildVideoOptions(videoTracks[0], options, quality)
                : null;
            if (!videoOptions || !await this.canTranscodeVideo(videoTracks[0], videoOptions.dimensions, quality)) {
                devLog('Required video decode or AVC encode capability is unavailable; skipping compression.');
                return { file, wasCompressed: false, wasSkipped: true };
            }

            const target = new BufferTarget();
            const output = new Output({ target, format: new Mp4OutputFormat({ fastStart: 'in-memory' }) });
            const conversion = await Conversion.init({
                input,
                output,
                video: async (track) => (track === videoTracks[0]
                    ? videoOptions.options
                    : (await this.buildVideoOptions(track, options, quality)).options),
                audio: (track) => this.buildAudioOptions(track, options, quality),
                showWarnings: false,
            });
            if (!conversion.isValid || conversion.discardedTracks.some(({ track }) => track.isVideoTrack() || track.isAudioTrack())) {
                devWarn('MediaBunny cannot preserve all required tracks; skipping compression.', conversion.discardedTracks);
                return { file, wasCompressed: false, wasSkipped: true };
            }

            conversion.onProgress = (progress) => this.updateProgress(progress * 100);
            this.abortController.signal.addEventListener('abort', () => void conversion.cancel(), { once: true });
            await conversion.execute();

            const aborted = this.abortRequested
                ? (this.resetProgress(), { file, wasCompressed: false, wasSkipped: true, aborted: true })
                : this.getAbortedResult(file);
            if (aborted) return aborted;
            if (!target.buffer) throw new Error('MediaBunny did not produce an output buffer.');

            const result = createCompressedResult(new Blob([target.buffer], { type: 'video/mp4' }), file);
            if (!result.wasCompressed) return result;
            if (audioTracks.length > 0 && !await this.outputPreservesAudio(result.file, audioTracks.length)) {
                devWarn('MediaBunny output lost input audio; keeping the original file.');
                return { file, wasCompressed: false, wasSkipped: true };
            }
            this.updateProgress(100);
            return result;
        } catch (error) {
            const aborted = this.abortRequested
                ? (this.resetProgress(), { file, wasCompressed: false, wasSkipped: true, aborted: true })
                : this.getAbortedResult(file);
            if (aborted) return aborted;
            devWarn('MediaBunny compression failed; keeping the original file.', error);
            return { file, wasCompressed: false, wasSkipped: true };
        } finally {
            input?.dispose();
            this.abortController = null;
        }
    }
}
