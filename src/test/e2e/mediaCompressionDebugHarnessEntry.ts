import '../../app.css';
import { mount } from 'svelte';
import MediaCompressionDebugPanel from '../../components/MediaCompressionDebugPanel.svelte';
import { startMediaCompressionDiagnostic } from '../../lib/videoCompression/mediaCompressionDiagnostics';

const target = document.getElementById('app');

if (!target) {
    throw new Error('Media compression debug harness mount target was not found.');
}

const session = startMediaCompressionDiagnostic(new File(['diagnostic'], 'ignored.mp4', { type: 'video/mp4' }));
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
    audioPath: 'native-aac',
});
session?.setConversion({ isValid: true, execute: 'success' });
session?.finish({
    file: new File(['output'], 'ignored-output.mp4', { type: 'video/mp4' }),
    wasCompressed: true,
});

mount(MediaCompressionDebugPanel, { target });
