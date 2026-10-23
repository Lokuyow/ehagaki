import {
    ALL_FORMATS, AudioBufferSource, BlobSource, BufferTarget, CanvasSource,
    Input, Output, QUALITY_HIGH, WebMOutputFormat,
} from 'mediabunny';
import { MediaBunnyCompression } from '../../lib/videoCompression/mediabunnyCompression';
import { VIDEO_COMPRESSION_OPTIONS_MAP } from '../../lib/videoCompression/videoCompressionConfig';

export interface VideoCompressionReport {
    wasCompressed: boolean;
    wasSkipped: boolean;
    aborted: boolean;
    keptOriginal: boolean;
    inputBytes: number;
    outputBytes: number;
    width: number;
    height: number;
    audioTrackCount: number;
    audioChannels: number;
    audioSampleRate: number;
    audible: boolean;
    videoReady: boolean;
    progress: number[];
}

async function createFixture(): Promise<File> {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D is unavailable');
    const target = new BufferTarget();
    const output = new Output({ target, format: new WebMOutputFormat() });
    const video = new CanvasSource(canvas, { codec: 'vp8', quality: QUALITY_HIGH });
    const audio = new AudioBufferSource({ codec: 'opus', quality: QUALITY_HIGH });
    output.addVideoTrack(video, { frameRate: 24 });
    output.addAudioTrack(audio);
    await output.start();

    const sound = new AudioBuffer({ numberOfChannels: 2, length: 48_000, sampleRate: 48_000 });
    for (let channel = 0; channel < sound.numberOfChannels; channel++) {
        const samples = sound.getChannelData(channel);
        for (let index = 0; index < samples.length; index++) {
            samples[index] = 0.2 * Math.sin(2 * Math.PI * 440 * index / sound.sampleRate);
        }
    }
    const audioDone = audio.add(sound);
    const image = context.createImageData(canvas.width, canvas.height);
    for (let frame = 0; frame < 24; frame++) {
        for (let index = 0; index < image.data.length; index += 4) {
            const value = Math.imul(index + frame * 104_729, 16_807);
            image.data[index] = value & 255;
            image.data[index + 1] = (value >>> 8) & 255;
            image.data[index + 2] = (value >>> 16) & 255;
            image.data[index + 3] = 255;
        }
        context.putImageData(image, 0, 0);
        await video.add(frame / 24, 1 / 24);
    }
    await audioDone;
    await output.finalize();
    if (!target.buffer) throw new Error('Fixture encoding produced no bytes');
    return new File([target.buffer], 'fixture.webm', { type: 'video/webm' });
}

async function run(mode: 'compress' | 'abort'): Promise<VideoCompressionReport> {
    const status = document.querySelector('#status');
    const video = document.querySelector<HTMLVideoElement>('#output');
    if (!status || !video) throw new Error('Harness elements are missing');
    status.textContent = 'Creating fixture';
    const file = await createFixture();
    const compression = new MediaBunnyCompression(() => false);
    const progress: number[] = [];
    compression.setProgressCallback(value => progress.push(value));
    status.textContent = 'Compressing';
    try {
        const operation = compression.compress(file, VIDEO_COMPRESSION_OPTIONS_MAP.low);
        if (mode === 'abort') compression.abort();
        const result = await operation;
        const report: VideoCompressionReport = {
            wasCompressed: result.wasCompressed,
            wasSkipped: result.wasSkipped ?? false,
            aborted: result.aborted ?? false,
            keptOriginal: result.file === file,
            inputBytes: file.size,
            outputBytes: result.file.size,
            width: 0, height: 0, audioTrackCount: 0, audioChannels: 0, audioSampleRate: 0,
            audible: false, videoReady: false, progress,
        };
        if (!result.wasCompressed) {
            status.textContent = report.aborted ? 'Cancelled' : 'Original retained';
            return report;
        }

        const input = new Input({ source: new BlobSource(result.file), formats: ALL_FORMATS });
        try {
            const track = await input.getPrimaryVideoTrack();
            const audioTracks = await input.getAudioTracks();
            report.width = await track?.getDisplayWidth() ?? 0;
            report.height = await track?.getDisplayHeight() ?? 0;
            report.audioTrackCount = audioTracks.length;
            report.audioChannels = await audioTracks[0]?.getNumberOfChannels() ?? 0;
            report.audioSampleRate = await audioTracks[0]?.getSampleRate() ?? 0;
        } finally {
            input.dispose();
        }
        const decoder = new OfflineAudioContext(1, 44_100, 44_100);
        const decoded = await decoder.decodeAudioData(await result.file.arrayBuffer());
        report.audible = decoded.getChannelData(0).some(value => Math.abs(value) > 0.01);
        const url = URL.createObjectURL(result.file);
        try {
            video.src = url;
            await video.play();
            await new Promise<void>(resolve => video.requestVideoFrameCallback(() => resolve()));
            report.videoReady = video.videoWidth === report.width && video.videoHeight === report.height;
            video.pause();
        } finally {
            URL.revokeObjectURL(url);
        }
        status.textContent = 'Compressed video and audio decoded';
        return report;
    } finally {
        await compression.cleanup();
    }
}

Reflect.set(window, '__VIDEO_COMPRESSION_HARNESS__', { run });
