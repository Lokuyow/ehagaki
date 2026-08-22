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
import {
    classifyMediaCompressionAudioPath,
    getAacCustomEncoderState,
    isMediaCompressionDebugAudioCopyEnabled,
    setAacCustomEncoderState,
    startMediaCompressionDiagnostic,
    type MediaCompressionDiagnosticSession,
} from './mediaCompressionDiagnostics';

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

function getQualityLabel(factor: number | null | undefined): string | undefined {
    if (factor === 0.3) return 'very-low';
    if (factor === 1) return 'medium';
    if (factor === 2) return 'high';
    return undefined;
}

function getCompressionLevel(options: any): string | undefined {
    if (options?.maxSize === 1280 && options?.mediabunnyVideoQualityFactor === 2) return 'high';
    if (options?.maxSize === 640 && options?.mediabunnyVideoQualityFactor === 1) return 'medium';
    if (options?.maxSize === 320 && options?.mediabunnyVideoQualityFactor === 0.3) return 'low';
    return undefined;
}

async function registerAacEncoder(
    diagnostic: MediaCompressionDiagnosticSession | null,
    audioTrackIndex: number,
): Promise<void> {
    if (diagnostic) {
        diagnostic.setAudio(audioTrackIndex, {
            customImport: aacEncoderRegistration
                ? getAacCustomEncoderState() === 'registered'
                    ? 'already registered'
                    : getAacCustomEncoderState() === 'failed'
                        ? 'failed'
                        : 'already loading'
                : 'yes',
            customRegistration: aacEncoderRegistration
                ? getAacCustomEncoderState() === 'failed' ? 'failure' : 'not-needed'
                : 'unknown',
        });
    }

    if (!aacEncoderRegistration) {
        setAacCustomEncoderState('loading');
        const startedAt = diagnostic ? performance.now() : null;
        aacEncoderRegistration = import('@mediabunny/aac-encoder')
            .then(({ registerAacEncoder }) => {
                registerAacEncoder();
                setAacCustomEncoderState('registered');
                if (diagnostic) diagnostic.setAudio(audioTrackIndex, { customRegistration: 'success' });
            })
            .catch((error) => {
                setAacCustomEncoderState('failed');
                diagnostic?.setAudio(audioTrackIndex, { customRegistration: 'failure', customImport: 'failed' });
                if (diagnostic && startedAt !== null) {
                    diagnostic.setAac({ loadRegisterDuration: Math.max(0, performance.now() - startedAt) });
                    diagnostic.setTiming('aac custom load/register', Math.max(0, performance.now() - startedAt));
                }
                throw error;
            });
        await aacEncoderRegistration;
        if (diagnostic && startedAt !== null) {
            diagnostic.setAac({ loadRegisterDuration: Math.max(0, performance.now() - startedAt) });
            diagnostic.setTiming('aac custom load/register', Math.max(0, performance.now() - startedAt));
        }
        return;
    }

    const startedAt = diagnostic ? performance.now() : null;
    await aacEncoderRegistration;
    if (diagnostic && startedAt !== null) {
        diagnostic.setTiming('aac custom load/register', Math.max(0, performance.now() - startedAt));
    }
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
        diagnostic: MediaCompressionDiagnosticSession | null,
        trackIndex: number,
    ): Promise<boolean> {
        const canDecode = await track.canDecode();
        diagnostic?.setVideo(trackIndex, { decode: canDecode });
        if (!canDecode) return false;
        const canEncode = await canEncodeVideo('avc', {
            ...dimensions,
            ...(quality ? { quality } : {}),
        });
        diagnostic?.setVideo(trackIndex, { avcEncode: canEncode });
        return canEncode;
    }

    private async buildAudioOptions(
        track: InputAudioTrack,
        options: any,
        quality: Quality | undefined,
        diagnostic: MediaCompressionDiagnosticSession | null,
        forcePacketCopy: boolean,
        trackIndex: number,
    ): Promise<ConversionAudioOptions> {
        const codec = await track.getCodec();
        const sourceChannels = await track.getNumberOfChannels();
        const sourceSampleRate = await track.getSampleRate();
        const canDecode = codec ? await canDecodeAudio(codec) : false;
        diagnostic?.setAudio(trackIndex, {
            codec,
            sourceChannels,
            sourceSampleRate,
            decode: canDecode,
        });

        const numberOfChannels = options.audioChannels ?? sourceChannels;
        const sampleRate = options.audioSampleRate ?? sourceSampleRate;
        const bitrate = this.parseAudioBitrate(options.audioBitrate);
        const effectiveEncodingMode = quality ? 'quality' as const : bitrate ? 'bitrate' as const : 'default' as const;
        const encoderOptions = {
            numberOfChannels,
            sampleRate,
            ...(quality ? { quality } : bitrate ? { bitrate } : {}),
        };

        diagnostic?.setAudio(trackIndex, {
            targetChannels: numberOfChannels,
            targetSampleRate: sampleRate,
            configuredBitrate: bitrate,
            quality: getQualityLabel(options.mediabunnyAudioQualityFactor),
            effectiveEncodingMode: forcePacketCopy ? 'packet-copy' : effectiveEncodingMode,
        });

        if (forcePacketCopy) {
            const nativeCapability = codec && canDecode ? await canEncodeAudio('aac', encoderOptions) : undefined;
            diagnostic?.setAudio(trackIndex, {
                nativeCapabilityBeforeRegistration: getAacCustomEncoderState() === 'not-loaded'
                    ? nativeCapability
                    : undefined,
                capabilityBeforeSelection: nativeCapability,
                audioPath: 'packet-copy',
                reason: 'debug-forced-packet-copy',
            });
            this.log('Media debug audio mode is forcing packet copy without transcoding.', { codec });
            return {};
        }

        if (!codec || !canDecode) {
            this.log('Audio decode is unavailable; preserving packets without transcoding.', { codec });
            diagnostic?.setAudio(trackIndex, { audioPath: 'packet-copy', reason: 'decode-unavailable' });
            return {};
        }

        const stateAtStart = getAacCustomEncoderState();
        const nativeCapability = await canEncodeAudio('aac', encoderOptions);
        diagnostic?.setAudio(trackIndex, {
            nativeCapabilityBeforeRegistration: stateAtStart === 'not-loaded' ? nativeCapability : undefined,
            capabilityBeforeSelection: nativeCapability,
            ...(stateAtStart === 'registered'
                ? { customImport: 'already registered' as const, customRegistration: 'not-needed' as const }
                : stateAtStart === 'not-loaded' && nativeCapability
                    ? { customImport: 'no' as const, customRegistration: 'not-needed' as const }
                    : {}),
        });

        if (!nativeCapability) {
            await registerAacEncoder(diagnostic, trackIndex);
        }
        const canEncode = await canEncodeAudio('aac', encoderOptions);
        const audioPath = classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart,
            capabilityBeforeSelection: nativeCapability,
            capabilityAfterRegistration: !nativeCapability ? canEncode : undefined,
            registrationSucceeded: getAacCustomEncoderState() === 'registered',
        });
        diagnostic?.setAudio(trackIndex, {
            capabilityAfterRegistration: !nativeCapability ? canEncode : undefined,
            audioPath: audioPath.path,
            ...(audioPath.reason ? { reason: audioPath.reason } : {}),
        });
        if (!canEncode) {
            this.log('AAC encoding is unavailable; preserving packets without transcoding.', { codec });
            return {};
        }

        return { codec: 'aac', forceTranscode: true, ...encoderOptions };
    }

    private async buildVideoOptions(
        track: InputVideoTrack,
        options: any,
        quality: Quality | undefined,
        diagnostic: MediaCompressionDiagnosticSession | null,
        trackIndex: number,
    ): Promise<{ options: ConversionVideoOptions; dimensions: { width: number; height: number } }> {
        const displayWidth = await track.getDisplayWidth();
        const displayHeight = await track.getDisplayHeight();
        const codec = diagnostic ? await track.getCodec() : undefined;
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

        diagnostic?.setVideo(trackIndex, {
            codec,
            displayWidth,
            displayHeight,
            targetWidth: width,
            targetHeight: height,
            compressionLevel: getCompressionLevel(options),
            quality: getQualityLabel(options?.mediabunnyVideoQualityFactor),
        });

        return { options: videoOptions, dimensions: { width, height } };
    }

    private async outputPreservesAudio(
        file: File,
        expectedTrackCount: number,
        diagnostic: MediaCompressionDiagnosticSession | null,
    ): Promise<boolean> {
        const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
        try {
            const audioTracks = await input.getAudioTracks();
            if (diagnostic) {
                for (const [index, track] of audioTracks.entries()) {
                    diagnostic.setAudio(index, {
                        outputCodec: await track.getCodec(),
                        outputSampleRate: await track.getSampleRate(),
                        outputChannels: await track.getNumberOfChannels(),
                    });
                }
            }
            return audioTracks.length >= expectedTrackCount;
        } finally {
            input.dispose();
        }
    }

    public async compressWithMediabunny(file: File, options: any): Promise<VideoCompressionResult> {
        let input: Input | null = null;
        const diagnostic = startMediaCompressionDiagnostic(file);
        const forceAudioPacketCopy = isMediaCompressionDebugAudioCopyEnabled();
        const finish = (result: VideoCompressionResult): VideoCompressionResult => {
            diagnostic?.finish(result);
            return result;
        };
        try {
            this.abortRequested = false;
            this.abortController = new AbortController();
            input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });

            const inspectionStartedAt = diagnostic ? performance.now() : null;
            const videoTracks = await input.getVideoTracks();
            const audioTracks = await input.getAudioTracks();
            diagnostic?.setTrackCounts(videoTracks.length, audioTracks.length);
            if (diagnostic) {
                diagnostic.setInputDuration(await input.getDurationFromMetadata());
                diagnostic.setTiming(
                    'input / track inspection',
                    inspectionStartedAt === null ? 0 : Math.max(0, performance.now() - inspectionStartedAt),
                );
            }
            const videoQuality = getQualityFromFactor(options?.mediabunnyVideoQualityFactor);
            const audioQuality = getQualityFromFactor(options?.mediabunnyAudioQualityFactor);

            const videoOptionsStartedAt = diagnostic ? performance.now() : null;
            const videoOptions = videoTracks.length > 0
                ? await this.buildVideoOptions(videoTracks[0], options, videoQuality, diagnostic, 0)
                : null;
            if (diagnostic && videoOptionsStartedAt !== null) {
                diagnostic.setTiming('video option construction', Math.max(0, performance.now() - videoOptionsStartedAt));
            }
            const videoCapabilityStartedAt = diagnostic ? performance.now() : null;
            const videoCanTranscode = videoOptions
                ? await this.canTranscodeVideo(videoTracks[0], videoOptions.dimensions, videoQuality, diagnostic, 0)
                : false;
            if (diagnostic && videoCapabilityStartedAt !== null) {
                diagnostic.setTiming('video capability', Math.max(0, performance.now() - videoCapabilityStartedAt));
            }
            if (!videoOptions || !videoCanTranscode) {
                this.log('Required video decode or AVC encode capability is unavailable; skipping compression.');
                diagnostic?.setConversion({ fallback: true, fallbackReason: 'video-capability-unavailable' });
                return finish({ file, wasCompressed: false, wasSkipped: true });
            }

            const target = new BufferTarget();
            const output = new Output({ target, format: new Mp4OutputFormat({ fastStart: 'in-memory' }) });
            const conversionInitStartedAt = diagnostic ? performance.now() : null;
            const conversion = await Conversion.init({
                input,
                output,
                video: async (track) => (track === videoTracks[0]
                    ? videoOptions.options
                    : (await this.buildVideoOptions(
                        track,
                        options,
                        videoQuality,
                        diagnostic,
                        videoTracks.indexOf(track),
                    )).options),
                audio: async (track) => {
                    const audioPreparationStartedAt = diagnostic ? performance.now() : null;
                    const result = await this.buildAudioOptions(
                        track,
                        options,
                        audioQuality,
                        diagnostic,
                        forceAudioPacketCopy,
                        Math.max(0, audioTracks.indexOf(track)),
                    );
                    if (diagnostic && audioPreparationStartedAt !== null) {
                        diagnostic.setTiming(
                            'audio preparation',
                            Math.max(0, performance.now() - audioPreparationStartedAt),
                        );
                    }
                    return result;
                },
                showWarnings: false,
            });
            if (diagnostic && conversionInitStartedAt !== null) {
                diagnostic.setTiming('conversion.init', Math.max(0, performance.now() - conversionInitStartedAt));
            }

            const discardedTracks = conversion.discardedTracks.map(({ track, reason }) => ({
                type: track.isVideoTrack() ? 'video' as const : track.isAudioTrack() ? 'audio' as const : 'other' as const,
                reason,
            }));
            diagnostic?.setConversion({
                isValid: conversion.isValid,
                discardedTracks,
                discardedVideoCount: discardedTracks.filter(({ type }) => type === 'video').length,
                discardedAudioCount: discardedTracks.filter(({ type }) => type === 'audio').length,
            });

            if (!conversion.isValid || conversion.discardedTracks.some(({ track }) => track.isVideoTrack() || track.isAudioTrack())) {
                devWarn(this.context, 'MediaBunny cannot preserve all required tracks; skipping compression.', conversion.discardedTracks);
                diagnostic?.setConversion({ fallback: true, fallbackReason: 'conversion-invalid-or-discarded-track' });
                return finish({ file, wasCompressed: false, wasSkipped: true });
            }

            conversion.onProgress = (progress) => this.updateProgress(progress * 100);
            this.abortController.signal.addEventListener('abort', () => void conversion.cancel(), { once: true });
            const conversionExecuteStartedAt = diagnostic ? performance.now() : null;
            try {
                await conversion.execute();
                diagnostic?.setConversion({ execute: 'success' });
            } catch (error) {
                diagnostic?.setConversion({ execute: 'failure' });
                throw error;
            } finally {
                if (diagnostic && conversionExecuteStartedAt !== null) {
                    diagnostic.setTiming('conversion.execute', Math.max(0, performance.now() - conversionExecuteStartedAt));
                }
            }

            const aborted = this.abortRequested
                ? { file, wasCompressed: false, wasSkipped: true, aborted: true }
                : this.checkAbort(file);
            if (aborted) {
                diagnostic?.setConversion({ fallback: true, fallbackReason: 'aborted' });
                return finish(aborted);
            }
            if (!target.buffer) throw new Error('MediaBunny did not produce an output buffer.');

            const fileCreationStartedAt = diagnostic ? performance.now() : null;
            const result = createCompressedFile(new Blob([target.buffer], { type: 'video/mp4' }), file, this.context);
            if (diagnostic && fileCreationStartedAt !== null) {
                diagnostic.setTiming('compressed File creation', Math.max(0, performance.now() - fileCreationStartedAt));
            }
            diagnostic?.setResult({ outputSize: result.file.size, wasCompressed: result.wasCompressed });
            if (!result.wasCompressed) {
                diagnostic?.setConversion({ fallback: true, fallbackReason: 'compressed-output-not-smaller' });
                return finish(result);
            }
            const audioVerificationStartedAt = diagnostic ? performance.now() : null;
            const audioPreserved = audioTracks.length === 0
                ? true
                : await this.outputPreservesAudio(result.file, audioTracks.length, diagnostic);
            diagnostic?.setResult({ outputAudioPreserved: audioPreserved });
            if (diagnostic && audioVerificationStartedAt !== null) {
                diagnostic.setTiming(
                    'output audio preservation verification',
                    Math.max(0, performance.now() - audioVerificationStartedAt),
                );
            }
            if (audioTracks.length > 0 && !audioPreserved) {
                devWarn(this.context, 'MediaBunny output lost input audio; keeping the original file.');
                diagnostic?.setConversion({ fallback: true, fallbackReason: 'output-audio-not-preserved' });
                return finish({ file, wasCompressed: false, wasSkipped: true });
            }

            this.updateProgress(100);
            return finish(result);
        } catch (error) {
            diagnostic?.setError(error);
            diagnostic?.setConversion({ execute: 'failure', fallback: true, fallbackReason: 'compression-error' });
            const aborted = this.abortRequested
                ? { file, wasCompressed: false, wasSkipped: true, aborted: true }
                : this.checkAbort(file);
            if (aborted) {
                diagnostic?.setConversion({ fallbackReason: 'aborted' });
                return finish(aborted);
            }
            devWarn(this.context, 'MediaBunny compression failed; keeping the original file.', error);
            return finish({ file, wasCompressed: false, wasSkipped: true });
        } finally {
            input?.dispose();
            this.abortController = null;
        }
    }
}
