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
import { BaseCompression } from './baseCompression';
import { createCompressedFile, devWarn } from './compressionUtils';

let aacEncoderRegistration: Promise<void> | null = null;

function ceilToMultipleOfTwo(value: number): number {
    return Math.ceil(value / 2) * 2;
}

function getQualityFromFactor(factor: number | null | undefined): Quality | undefined {
    if (factor === 0.3) return QUALITY_VERY_LOW;
    if (factor === 1) return QUALITY_MEDIUM;
    if (factor === 2) return QUALITY_HIGH;
    return undefined;
}

async function registerAacEncoder(): Promise<void> {
    if (!aacEncoderRegistration) {
        aacEncoderRegistration = import('@mediabunny/aac-encoder').then(({ registerAacEncoder }) => {
            registerAacEncoder();
        });
    }
    await aacEncoderRegistration;
}

export class MediaBunnyCompression extends BaseCompression {
    private abortController: AbortController | null = null;
    private abortRequested = false;

    constructor(
        private parseAudioBitrate: (audioBitrate: unknown) => number | null,
        isUploadAborted: UploadAbortChecker = isDefaultUploadAborted,
    ) {
        super('MediaBunnyCompression', isUploadAborted);
    }

    public abort(): void {
        this.abortRequested = true;
        this.resetProgress();
        this.abortController?.abort();
    }

    public async cleanup(): Promise<void> {
        this.abortController = null;
    }

    private async canTranscodeVideo(
        track: InputVideoTrack,
        dimensions: { width: number; height: number },
        quality: Quality | undefined,
    ): Promise<boolean> {
        if (!await track.canDecode()) return false;
        return canEncodeVideo('avc', {
            ...dimensions,
            ...(quality ? { quality } : {}),
        });
    }

    private async buildAudioOptions(
        track: InputAudioTrack,
        options: any,
        quality: Quality | undefined,
    ): Promise<ConversionAudioOptions> {
        if (!track.codec || !await canDecodeAudio(track.codec)) {
            this.log('Audio decode is unavailable; preserving packets without transcoding.', { codec: track.codec });
            return {};
        }

        const numberOfChannels = options.audioChannels ?? track.numberOfChannels;
        const sampleRate = options.audioSampleRate ?? track.sampleRate;
        const bitrate = this.parseAudioBitrate(options.audioBitrate);
        const encoderOptions = {
            numberOfChannels,
            sampleRate,
            ...(quality ? { quality } : bitrate ? { bitrate } : {}),
        };

        if (!await canEncodeAudio('aac', encoderOptions)) {
            await registerAacEncoder();
        }
        if (!await canEncodeAudio('aac', encoderOptions)) {
            this.log('AAC encoding is unavailable; preserving packets without transcoding.', { codec: track.codec });
            return {};
        }

        return { codec: 'aac', forceTranscode: true, ...encoderOptions };
    }

    private async buildVideoOptions(
        track: InputVideoTrack,
        options: any,
        quality: Quality | undefined,
    ): Promise<{ options: ConversionVideoOptions; dimensions: { width: number; height: number } }> {
        const displayWidth = await track.getDisplayWidth();
        const displayHeight = await track.getDisplayHeight();
        const videoOptions: ConversionVideoOptions = {
            codec: 'avc',
            forceTranscode: true,
            ...(quality ? { quality } : {}),
        };
        if (typeof options.maxSize === 'number' && Number.isFinite(options.maxSize)) {
            if (displayWidth > displayHeight) {
                videoOptions.width = Math.min(displayWidth, options.maxSize);
            } else {
                videoOptions.height = Math.min(displayHeight, options.maxSize);
            }
        }

        // Keep capability dimensions identical to MediaBunny's one-sided conversion resize:
        // the requested side is rounded up to an even number, then the other side is inferred
        // from the input aspect ratio and rounded up to an even number as well.
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

    public async compressWithMediabunny(file: File, options: any): Promise<VideoCompressionResult> {
        let input: Input | null = null;
        try {
            this.abortRequested = false;
            this.abortController = new AbortController();
            input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });

            const videoTracks = await input.getVideoTracks();
            const audioTracks = await input.getAudioTracks();
            const videoQuality = getQualityFromFactor(options?.mediabunnyVideoQualityFactor);
            const audioQuality = getQualityFromFactor(options?.mediabunnyAudioQualityFactor);

            const videoOptions = videoTracks.length > 0
                ? await this.buildVideoOptions(videoTracks[0], options, videoQuality)
                : null;
            if (!videoOptions || !await this.canTranscodeVideo(videoTracks[0], videoOptions.dimensions, videoQuality)) {
                this.log('Required video decode or AVC encode capability is unavailable; skipping compression.');
                return { file, wasCompressed: false, wasSkipped: true };
            }

            const target = new BufferTarget();
            const output = new Output({ target, format: new Mp4OutputFormat({ fastStart: 'in-memory' }) });
            const conversion = await Conversion.init({
                input,
                output,
                video: async (track) => (track === videoTracks[0]
                    ? videoOptions.options
                    : (await this.buildVideoOptions(track, options, videoQuality)).options),
                audio: (track) => this.buildAudioOptions(track, options, audioQuality),
                showWarnings: false,
            });

            if (!conversion.isValid || conversion.discardedTracks.some(({ track }) => track.isVideoTrack() || track.isAudioTrack())) {
                devWarn(this.context, 'MediaBunny cannot preserve all required tracks; skipping compression.', conversion.discardedTracks);
                return { file, wasCompressed: false, wasSkipped: true };
            }

            conversion.onProgress = (progress) => this.updateProgress(progress * 100);
            this.abortController.signal.addEventListener('abort', () => void conversion.cancel(), { once: true });
            await conversion.execute();

            const aborted = this.abortRequested
                ? { file, wasCompressed: false, wasSkipped: true, aborted: true }
                : this.checkAbort(file);
            if (aborted) return aborted;
            if (!target.buffer) throw new Error('MediaBunny did not produce an output buffer.');

            const result = createCompressedFile(new Blob([target.buffer], { type: 'video/mp4' }), file, this.context);
            if (!result.wasCompressed) return result;
            if (audioTracks.length > 0 && !await this.outputPreservesAudio(result.file, audioTracks.length)) {
                devWarn(this.context, 'MediaBunny output lost input audio; keeping the original file.');
                return { file, wasCompressed: false, wasSkipped: true };
            }

            this.updateProgress(100);
            return result;
        } catch (error) {
            const aborted = this.abortRequested
                ? { file, wasCompressed: false, wasSkipped: true, aborted: true }
                : this.checkAbort(file);
            if (aborted) return aborted;
            devWarn(this.context, 'MediaBunny compression failed; keeping the original file.', error);
            return { file, wasCompressed: false, wasSkipped: true };
        } finally {
            input?.dispose();
            this.abortController = null;
        }
    }
}
