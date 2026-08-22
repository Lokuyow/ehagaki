import '../../app.css';
import { mount } from 'svelte';
import MediaCompressionDebugPanel from '../../components/MediaCompressionDebugPanel.svelte';
import {
    isMediaCompressionDebugAudioCopyEnabled,
    isMediaCompressionDebugRawVideoEncoderEnabled,
    isMediaCompressionDebugVideoRealtimeEnabled,
    startMediaCompressionDiagnostic,
} from '../../lib/videoCompression/mediaCompressionDiagnostics';
import {
    RAW_VIDEO_ENCODER_BENCHMARK_CONFIG,
    RAW_VIDEO_ENCODER_BENCHMARK_SOURCE,
    type RawVideoEncoderBenchmarkResult,
} from '../../lib/videoCompression/rawVideoEncoderBenchmark';

declare global {
    interface Window {
        completeRawVideoEncoderBenchmark?: () => void;
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

mount(MediaCompressionDebugPanel, { target, props: { rawVideoEncoderBenchmarkRunner } });
