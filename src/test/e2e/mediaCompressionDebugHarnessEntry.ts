import '../../app.css';
import { mount } from 'svelte';
import MediaCompressionDebugPanel from '../../components/MediaCompressionDebugPanel.svelte';
import {
    isMediaCompressionDebugAudioCopyEnabled,
    isMediaCompressionDebugRawVideoEncoderEnabled,
    isMediaCompressionDebugVideoBitrateEnabled,
    isMediaCompressionDebugVideoDecodeBenchmarkEnabled,
    isMediaCompressionDebugVideoPipelineBenchmarkEnabled,
    isMediaCompressionDebugVideoRealtimeEnabled,
    startMediaCompressionDiagnostic,
} from '../../lib/videoCompression/mediaCompressionDiagnostics';
import {
    RAW_VIDEO_ENCODER_BENCHMARK_CONFIG,
    RAW_VIDEO_ENCODER_BENCHMARK_SOURCE,
    type RawVideoEncoderBenchmarkResult,
} from '../../lib/videoCompression/rawVideoEncoderBenchmark';
import type { VideoDecodeBenchmarkResult } from '../../lib/videoCompression/videoDecodeBenchmark';
import type { LegacyLikeCanvasPipelineBenchmarkResult } from '../../lib/videoCompression/legacyLikeCanvasPipelineBenchmark';
import type { RealVideoPipelineBenchmarkResult } from '../../lib/videoCompression/realVideoPipelineBenchmark';

declare global {
    interface Window {
        completeRawVideoEncoderBenchmark?: () => void;
        completeOffscreenCanvasVideoEncoderBenchmark?: () => void;
        completeVideoDecodeBenchmark?: () => void;
        completeRealVideoPipelineBenchmark?: () => void;
        completeLegacyLikeCanvasPipelineBenchmark?: () => void;
    }
}

const target = document.getElementById('app');

if (!target) {
    throw new Error('Media compression debug harness mount target was not found.');
}

const session = startMediaCompressionDiagnostic(new File(['diagnostic'], 'ignored.mp4', { type: 'video/mp4' }));
const forceAudioPacketCopy = isMediaCompressionDebugAudioCopyEnabled();
const realtimeVideoLatency = isMediaCompressionDebugVideoRealtimeEnabled();
const rawVideoEncoderBenchmark = isMediaCompressionDebugRawVideoEncoderEnabled();
const videoBitrateRateControl = isMediaCompressionDebugVideoBitrateEnabled();
const videoDecodeBenchmark = isMediaCompressionDebugVideoDecodeBenchmarkEnabled();
const realVideoPipelineBenchmark = isMediaCompressionDebugVideoPipelineBenchmarkEnabled();
session?.setTrackCounts(1, 1);
session?.setVideo(0, {
    codec: 'avc',
    displayWidth: 1920,
    displayHeight: 1080,
    targetWidth: 640,
    targetHeight: 360,
    decode: true,
    avcEncode: true,
    compressionLevel: 'medium',
    quality: 'medium',
    ...(videoBitrateRateControl ? { configuredBitrate: 400_000, bitrateMode: 'variable' as const } : {}),
    inputPacketStats: {
        packetCount: 627,
        averagePacketRate: 30,
        averageBitrate: 4_000_000,
        duration: 20.9,
    },
    outputPacketStats: {
        packetCount: realtimeVideoLatency ? 620 : 627,
        averagePacketRate: realtimeVideoLatency ? 29.7 : 30,
        averageBitrate: realtimeVideoLatency ? 3_900_000 : 4_000_000,
        duration: 20.9,
    },
});
session?.setAudio(0, {
    codec: 'aac',
    sourceSampleRate: 48000,
    sourceChannels: 2,
    targetSampleRate: 44100,
    targetChannels: 2,
    decode: true,
    nativeCapabilityBeforeRegistration: true,
    capabilityBeforeSelection: true,
    customImport: 'no',
    customRegistration: 'not-needed',
    effectiveEncodingMode: forceAudioPacketCopy ? 'packet-copy' : 'quality',
    configuredBitrate: 64000,
    audioPath: forceAudioPacketCopy ? 'packet-copy' : 'native-aac',
    reason: forceAudioPacketCopy ? 'debug-forced-packet-copy' : undefined,
    outputCodec: 'aac',
    outputSampleRate: forceAudioPacketCopy ? 48000 : 44100,
    outputChannels: 2,
});
session?.setConversion({ isValid: true, execute: 'success' });
session?.finish({
    file: new File(['output'], 'ignored-output.mp4', { type: 'video/mp4' }),
    wasCompressed: true,
});

const rawVideoEncoderBenchmarkRunner = rawVideoEncoderBenchmark
    ? () => new Promise<RawVideoEncoderBenchmarkResult>((resolve) => {
        window.completeRawVideoEncoderBenchmark = () => {
            resolve({
                status: 'completed',
                source: RAW_VIDEO_ENCODER_BENCHMARK_SOURCE,
                canvasSource: 'html-canvas',
                config: { ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG },
                frameCount: 3,
                queueLimit: 2,
                maxQueueSize: 2,
                timings: {
                    configSupportCheck: 1,
                    encoderSetupConfigure: 2,
                    benchmarkWall: 30,
                    framePreparationSync: 3,
                    encodeSubmissionSync: 4,
                    backpressureWait: 5,
                    flushWait: 6,
                },
                framesSubmitted: 3,
                chunks: 3,
                bytes: 240,
                keyChunks: 1,
                deltaChunks: 2,
                throughput: 100,
            });
        };
    })
    : undefined;

const offscreenCanvasVideoEncoderBenchmarkRunner = rawVideoEncoderBenchmark
    ? () => new Promise<RawVideoEncoderBenchmarkResult>((resolve) => {
        window.completeOffscreenCanvasVideoEncoderBenchmark = () => {
            resolve({
                status: 'completed',
                source: RAW_VIDEO_ENCODER_BENCHMARK_SOURCE,
                canvasSource: 'offscreen-canvas',
                config: { ...RAW_VIDEO_ENCODER_BENCHMARK_CONFIG },
                frameCount: 3,
                queueLimit: 2,
                maxQueueSize: 2,
                timings: {
                    configSupportCheck: 1,
                    encoderSetupConfigure: 2,
                    benchmarkWall: 30,
                    framePreparationSync: 3,
                    encodeSubmissionSync: 4,
                    backpressureWait: 5,
                    flushWait: 6,
                },
                framesSubmitted: 3,
                chunks: 3,
                bytes: 240,
                keyChunks: 1,
                deltaChunks: 2,
                throughput: 100,
            });
        };
    })
    : undefined;

const videoDecodeBenchmarkRunner = videoDecodeBenchmark
    ? () => new Promise<VideoDecodeBenchmarkResult>((resolve) => {
        window.completeVideoDecodeBenchmark = () => {
            resolve({
                status: 'completed',
                input: {
                    mime: 'video/quicktime',
                    size: 39_681_322,
                    duration: 20.9,
                    videoCodec: 'avc',
                    displayWidth: 1080,
                    displayHeight: 1920,
                },
                decode: {
                    samplesDecoded: 627,
                    firstSample: {
                        format: 'NV12',
                        codedWidth: 1080,
                        codedHeight: 1920,
                        displayWidth: 1080,
                        displayHeight: 1920,
                    },
                    milestoneOffsets: { 1: 10, 100: 1000, 300: 3000, 500: 5000, 627: 6270 },
                    lastSampleOffset: 6270,
                },
                timing: { inputTrackSetup: 12, decodeWall: 6280, throughput: 99.84 },
            });
        };
    })
    : undefined;

const realVideoPipelineBenchmarkRunner = realVideoPipelineBenchmark
    ? () => new Promise<RealVideoPipelineBenchmarkResult>((resolve) => {
        window.completeRealVideoPipelineBenchmark = () => {
            resolve({
                pipelineKind: 'mediabunny-transform',
                status: 'completed',
                input: {
                    mime: 'video/quicktime',
                    size: 39_681_322,
                    duration: 20.9,
                    videoCodec: 'avc1.4d401f',
                    codedWidth: 1_920,
                    codedHeight: 1_080,
                    displayWidth: 1_080,
                    displayHeight: 1_920,
                    rotation: 90,
                },
                target: { width: 360, height: 640, fit: 'fill', rotate: 0, alpha: 'discard' },
                capabilities: { decode: true, avcEncode: true },
                samplesProcessed: 627,
                framesSubmitted: 627,
                encodedChunks: 627,
                encodedBytes: 395_052,
                keyChunks: 1,
                deltaChunks: 626,
                maxQueueSize: 4,
                throughput: 98.4,
                timings: {
                    inputTrackSetup: 12,
                    sampleWaitIteration: 6_300,
                    videoTransform: 5_200,
                    videoFrameCreation: 1_800,
                    encodeSubmissionSync: 30,
                    backpressureWait: 8_400,
                    flushWait: 1_200,
                    benchmarkTotalWall: 16_600,
                },
            });
        };
    })
    : undefined;

const legacyLikeCanvasPipelineBenchmarkRunner = realVideoPipelineBenchmark
    ? () => new Promise<LegacyLikeCanvasPipelineBenchmarkResult>((resolve) => {
        window.completeLegacyLikeCanvasPipelineBenchmark = () => {
            resolve({
                pipelineKind: 'legacy-like-html-canvas',
                status: 'completed',
                input: {
                    mime: 'video/quicktime',
                    size: 39_681_321,
                    duration: 20.905,
                    videoCodec: 'avc1.4d401f',
                    codedWidth: 1_920,
                    codedHeight: 1_080,
                    displayWidth: 1_080,
                    displayHeight: 1_920,
                    rotation: 90,
                },
                target: { width: 360, height: 640, fit: 'fill', rotate: 0, alpha: 'discard' },
                capabilities: { decode: true, avcEncode: true },
                samplesProcessed: 627,
                framesSubmitted: 627,
                encodedChunks: 627,
                encodedBytes: 400_000,
                keyChunks: 5,
                deltaChunks: 622,
                maxQueueSize: 4,
                throughput: 40,
                timings: {
                    inputTrackSetup: 12,
                    sampleWaitIteration: 686,
                    sourceVideoFrameAcquisition: 8,
                    canvasDrawRotationResize: 500,
                    outputVideoFrameCreation: 8,
                    encodeSubmissionSync: 21,
                    backpressureWait: 9,
                    flushWait: 6,
                    benchmarkTotalWall: 1_250,
                },
            });
        };
    })
    : undefined;

mount(MediaCompressionDebugPanel, {
    target,
    props: {
        rawVideoEncoderBenchmarkRunner,
        offscreenCanvasVideoEncoderBenchmarkRunner,
        videoDecodeBenchmarkRunner,
        realVideoPipelineBenchmarkRunner,
        legacyLikeCanvasPipelineBenchmarkRunner,
    },
});
