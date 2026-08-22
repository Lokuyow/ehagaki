import '../../app.css';
import { mount } from 'svelte';
import MediaCompressionDebugPanel from '../../components/MediaCompressionDebugPanel.svelte';
import {
    isMediaCompressionDebugAudioCopyEnabled,
    isMediaCompressionDebugVideoRealtimeEnabled,
    startMediaCompressionDiagnostic,
} from '../../lib/videoCompression/mediaCompressionDiagnostics';

const target = document.getElementById('app');

if (!target) {
    throw new Error('Media compression debug harness mount target was not found.');
}

const session = startMediaCompressionDiagnostic(new File(['diagnostic'], 'ignored.mp4', { type: 'video/mp4' }));
const forceAudioPacketCopy = isMediaCompressionDebugAudioCopyEnabled();
const realtimeVideoLatency = isMediaCompressionDebugVideoRealtimeEnabled();
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

mount(MediaCompressionDebugPanel, { target });
