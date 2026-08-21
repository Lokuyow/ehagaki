import {
    ALL_FORMATS,
    BlobSource,
    BufferTarget,
    canDecodeAudio,
    canDecodeVideo,
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
        quality: Quality | undefined,
    ): Promise<boolean> {
        if (!track.codec || !await canDecodeVideo(track.codec)) return false;
        return canEncodeVideo('avc', {
            width: track.displayWidth,
            height: track.displayHeight,
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

    private buildVideoOptions(
        track: InputVideoTrack,
        options: any,
        quality: Quality | undefined,
    ): ConversionVideoOptions {
        const videoOptions: ConversionVideoOptions = {
            codec: 'avc',
            forceTranscode: true,
            ...(quality ? { quality } : {}),
        };
        if (typeof options.maxSize === 'number' && Number.isFinite(options.maxSize)) {
            if (track.displayWidth > track.displayHeight) {
                videoOptions.width = Math.min(track.displayWidth, options.maxSize);
            } else {
                videoOptions.height = Math.min(track.displayHeight, options.maxSize);
            }
        }
        return videoOptions;
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

            if (videoTracks.length === 0 || !await this.canTranscodeVideo(videoTracks[0], videoQuality)) {
                this.log('Required video decode or AVC encode capability is unavailable; skipping compression.');
                return { file, wasCompressed: false, wasSkipped: true };
            }

            const target = new BufferTarget();
            const output = new Output({ target, format: new Mp4OutputFormat({ fastStart: 'in-memory' }) });
            const conversion = await Conversion.init({
                input,
                output,
                video: (track) => this.buildVideoOptions(track, options, videoQuality),
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
