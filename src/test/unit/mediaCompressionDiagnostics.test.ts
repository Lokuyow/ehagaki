import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import MediaCompressionDebugPanel from '../../components/MediaCompressionDebugPanel.svelte';
import {
    classifyMediaCompressionAudioPath,
    addVideoDecodeBenchmarkRecord,
    clearMediaCompressionDiagnosticRecords,
    formatMediaCompressionDiagnostics,
    getAacCustomEncoderState,
    getMediaCompressionAudioDiagnosticMode,
    getMediaCompressionDiagnosticRecords,
    getMediaCompressionVideoDiagnosticMode,
    getMediaCompressionVideoRateControlMode,
    isMediaCompressionDebugEnabled,
    isMediaCompressionDebugAudioCopyEnabled,
    isMediaCompressionDebugRawVideoEncoderEnabled,
    isMediaCompressionDebugVideoDecodeBenchmarkEnabled,
    isMediaCompressionDebugVideoBitrateEnabled,
    isMediaCompressionDebugVideoRealtimeEnabled,
    startMediaCompressionDiagnostic,
} from '../../lib/videoCompression/mediaCompressionDiagnostics';

function setSearch(search: string): void {
    window.history.replaceState({}, '', `${search || '/'}${search ? '' : ''}`);
}

describe('media compression diagnostics', () => {
    beforeEach(() => {
        setSearch('');
        clearMediaCompressionDiagnosticRecords();
    });

    afterEach(() => {
        setSearch('');
        clearMediaCompressionDiagnosticRecords();
    });

    it('is disabled unless media-debug=1 is present', () => {
        expect(isMediaCompressionDebugEnabled('')).toBe(false);
        expect(isMediaCompressionDebugEnabled('?media-debug=0')).toBe(false);
        expect(isMediaCompressionDebugEnabled('?media-debug=1')).toBe(true);
        expect(isMediaCompressionDebugAudioCopyEnabled('?media-debug-audio=copy')).toBe(false);
        expect(isMediaCompressionDebugAudioCopyEnabled('?media-debug=1&media-debug-audio=copy')).toBe(true);
        expect(isMediaCompressionDebugVideoRealtimeEnabled('?media-debug-video-latency=realtime')).toBe(false);
        expect(isMediaCompressionDebugVideoRealtimeEnabled('?media-debug=1&media-debug-video-latency=realtime')).toBe(false);
        expect(isMediaCompressionDebugVideoRealtimeEnabled('?media-debug=1&media-debug-audio=copy&media-debug-video-latency=realtime')).toBe(true);
        expect(isMediaCompressionDebugVideoBitrateEnabled('?media-debug-video-rate-control=bitrate')).toBe(false);
        expect(isMediaCompressionDebugVideoBitrateEnabled('?media-debug=1&media-debug-video-rate-control=bitrate')).toBe(false);
        expect(isMediaCompressionDebugVideoBitrateEnabled('?media-debug=1&media-debug-audio=copy')).toBe(false);
        expect(isMediaCompressionDebugVideoBitrateEnabled('?media-debug=1&media-debug-audio=copy&media-debug-video-rate-control=bitrate')).toBe(true);
        expect(isMediaCompressionDebugRawVideoEncoderEnabled('?media-debug-raw-video-encoder=1')).toBe(false);
        expect(isMediaCompressionDebugRawVideoEncoderEnabled('?media-debug=1')).toBe(false);
        expect(isMediaCompressionDebugRawVideoEncoderEnabled('?media-debug=1&media-debug-raw-video-encoder=1')).toBe(true);
        expect(isMediaCompressionDebugVideoDecodeBenchmarkEnabled('?media-debug-video-decode-benchmark=1')).toBe(false);
        expect(isMediaCompressionDebugVideoDecodeBenchmarkEnabled('?media-debug=1')).toBe(false);
        expect(isMediaCompressionDebugVideoDecodeBenchmarkEnabled('?media-debug=1&media-debug-video-decode-benchmark=1')).toBe(true);
        expect(getMediaCompressionAudioDiagnosticMode('?media-debug=1')).toBe('normal');
        expect(getMediaCompressionAudioDiagnosticMode('?media-debug=1&media-debug-audio=copy')).toBe('force-packet-copy');
        expect(getMediaCompressionVideoDiagnosticMode('?media-debug=1')).toBe('default-quality');
        expect(getMediaCompressionVideoDiagnosticMode('?media-debug=1&media-debug-audio=copy&media-debug-video-latency=realtime')).toBe('realtime');
        expect(getMediaCompressionVideoRateControlMode('?media-debug=1&media-debug-audio=copy')).toBe('subjective-quality');
        expect(getMediaCompressionVideoRateControlMode('?media-debug=1&media-debug-audio=copy&media-debug-video-rate-control=bitrate')).toBe('explicit-bitrate');
        expect(startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }))).toBeNull();
        expect(getMediaCompressionDiagnosticRecords()).toHaveLength(0);
    });

    it('creates a readable Conversion #1 record and Clear removes records only', () => {
        setSearch('?media-debug=1');
        const session = startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }));
        expect(session?.conversionId).toBe(1);
        session?.setTrackCounts(1, 1);
        session?.setAudio(0, {
            codec: 'aac',
            sourceSampleRate: 48000,
            sourceChannels: 2,
            audioPath: 'native-aac',
        });
        session?.setVideo(0, {
            inputPacketStats: {
                packetCount: 627,
                averagePacketRate: 30,
                averageBitrate: 4_000_000,
                duration: 20.9,
            },
            outputPacketStats: {
                packetCount: 627,
                averagePacketRate: 30,
                averageBitrate: 3_900_000,
                duration: 20.9,
            },
        });
        session?.finish({
            file: new File(['compressed'], 'output.mp4', { type: 'video/mp4' }),
            wasCompressed: true,
        });

        const text = formatMediaCompressionDiagnostics();
        expect(text).toContain('Conversion #1');
        expect(text).toContain('audio path: native-aac');
        expect(text).toContain('input frames: 627');
        expect(text).toContain('output FPS: 30.00');
        expect(text).toContain('total compression:');
        expect(text).not.toContain('clip.mp4');

        clearMediaCompressionDiagnosticRecords();
        expect(getMediaCompressionDiagnosticRecords()).toHaveLength(0);
        expect(getAacCustomEncoderState()).toBe('not-loaded');
    });

    it('records and formats the forced packet-copy mode only when both query parameters are present', () => {
        setSearch('?media-debug-audio=copy');
        expect(startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }))).toBeNull();

        setSearch('?media-debug=1&media-debug-audio=copy');
        const session = startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }));
        session?.setAudio(0, {
            sourceSampleRate: 48000,
            sourceChannels: 2,
            targetSampleRate: 44100,
            targetChannels: 2,
            effectiveEncodingMode: 'packet-copy',
            audioPath: 'packet-copy',
            reason: 'debug-forced-packet-copy',
            outputCodec: 'aac',
            outputSampleRate: 48000,
            outputChannels: 2,
        });

        const text = formatMediaCompressionDiagnostics();
        expect(text).toContain('Forced audio packet copy');
        expect(text).toContain('audio diagnostic mode: force-packet-copy');
        expect(text).toContain('normal target: 44100 Hz / 2ch');
        expect(text).toContain('reason: debug-forced-packet-copy');
        expect(text).toContain('output audio: 48000 Hz / 2ch');
    });

    it('formats realtime video diagnostics and keeps packet scan timing separate', () => {
        setSearch('?media-debug=1&media-debug-audio=copy&media-debug-video-latency=realtime');
        const session = startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }));
        session?.setVideo(0, {
            inputPacketStats: { packetCount: 627, averagePacketRate: 30, averageBitrate: 4_000_000, duration: 20.9 },
            outputPacketStats: { packetCount: 620, averagePacketRate: 29.7, averageBitrate: 3_900_000, duration: 20.9 },
        });
        session?.setTiming('input video stats scan', 25);
        session?.setTiming('output video stats scan', 35);
        session?.setTiming('conversion.execute', 16600);
        session?.finish({
            file: new File(['output'], 'output.mp4', { type: 'video/mp4' }),
            wasCompressed: true,
        });

        const text = formatMediaCompressionDiagnostics();
        expect(text).toContain('Video latency: realtime');
        expect(text).toContain('video diagnostic mode: realtime');
        expect(text).toContain('input frames: 627');
        expect(text).toContain('output frames: 620');
        expect(text).toContain('input video stats scan: 25.0 ms');
        expect(text).toContain('output video stats scan: 35.0 ms');
        expect(text).toContain('conversion.execute: 16600.0 ms');
    });

    it('formats decode-only results without retaining a selected file name or samples', () => {
        setSearch('?media-debug=1&media-debug-video-decode-benchmark=1');
        addVideoDecodeBenchmarkRecord({
            status: 'completed',
            input: { mime: 'video/quicktime', size: 39_681_322, duration: 20.9, videoCodec: 'avc', displayWidth: 1080, displayHeight: 1920 },
            decode: {
                samplesDecoded: 627,
                firstSample: { format: 'NV12', codedWidth: 1080, codedHeight: 1920, displayWidth: 1080, displayHeight: 1920 },
                milestoneOffsets: { 1: 11, 100: 1200, 300: 3400, 500: 5400, 627: 6800 },
                lastSampleOffset: 6800,
            },
            timing: { inputTrackSetup: 12, decodeWall: 6900, throughput: 90.87 },
        });

        const text = formatMediaCompressionDiagnostics();
        expect(text).toContain('Video decode benchmark: enabled (manual run)');
        expect(text).toContain('Video Decode Benchmark #1');
        expect(text).toContain('samples decoded: 627');
        expect(text).toContain('sample #627: +6800.0 ms');
        expect(text).toContain('No resize, video encode, audio, muxing, or file output is performed by this benchmark.');
        expect(text).not.toContain('.mov');
    });

    it('classifies native, custom, packet-copy, and unknown paths from observed state', () => {
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'not-loaded',
            capabilityBeforeSelection: true,
        })).toEqual({ path: 'native-aac' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'not-loaded',
            capabilityBeforeSelection: false,
            capabilityAfterRegistration: true,
            registrationSucceeded: true,
        })).toEqual({ path: 'custom-aac' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'not-loaded',
            capabilityBeforeSelection: false,
            capabilityAfterRegistration: false,
        })).toEqual({ path: 'packet-copy', reason: 'aac-encode-unavailable' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: false,
            stateAtStart: 'not-loaded',
            capabilityBeforeSelection: false,
        })).toEqual({ path: 'packet-copy', reason: 'decode-unavailable' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'registered',
            capabilityBeforeSelection: true,
        })).toEqual({ path: 'custom-aac' });
        expect(classifyMediaCompressionAudioPath({
            decodeAvailable: true,
            stateAtStart: 'loading',
            capabilityBeforeSelection: true,
        })).toEqual({ path: 'unknown' });
    });

    it('shows only in diagnostic mode and wires expand, Copy, and Clear', async () => {
        const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText: clipboardWriteText },
        });

        const withoutDebug = render(MediaCompressionDebugPanel);
        expect(withoutDebug.container.querySelector('.media-debug-panel')).toBeNull();
        withoutDebug.unmount();

        setSearch('?media-debug=1');
        const session = startMediaCompressionDiagnostic(new File(['x'], 'clip.mp4', { type: 'video/mp4' }));
        const conversionId = session?.conversionId;
        session?.finish({
            file: new File(['y'], 'output.mp4', { type: 'video/mp4' }),
            wasCompressed: true,
        });
        render(MediaCompressionDebugPanel);

        expect(screen.getByRole('button', { name: /Media Compression Debug/ }).getAttribute('aria-expanded')).toBe('false');
        await fireEvent.click(screen.getByRole('button', { name: /Media Compression Debug/ }));
        expect(document.querySelector('pre')?.textContent).toContain(`Conversion #${conversionId}`);
        await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
        expect(clipboardWriteText).toHaveBeenCalledWith(expect.stringContaining(`Conversion #${conversionId}`));
        await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
        expect(document.querySelector('pre')?.textContent).toContain('No conversions recorded.');
        expect(getAacCustomEncoderState()).toBe('not-loaded');
    });

    it('shows the manual raw encoder control only for its fully gated diagnostic query', async () => {
        setSearch('?media-debug=1&media-debug-raw-video-encoder=1');
        const rawRunner = vi.fn().mockResolvedValue({
            status: 'failed',
            source: 'canvas-2d synthetic pattern',
            canvasSource: 'html-canvas',
            config: { codec: 'avc1.64001E', width: 360, height: 640, framerate: 30, bitrate: 400_000 },
            frameCount: 627,
            queueLimit: 4,
            maxQueueSize: 0,
            framesSubmitted: 0,
            chunks: 0,
            bytes: 0,
            keyChunks: 0,
            deltaChunks: 0,
            timings: {
                configSupportCheck: 1,
                encoderSetupConfigure: 0,
                benchmarkWall: 0,
                framePreparationSync: 0,
                encodeSubmissionSync: 0,
                backpressureWait: 0,
                flushWait: 0,
            },
            failure: { stage: 'api-unavailable', message: 'VideoEncoder or VideoFrame is unavailable.' },
        });
        render(MediaCompressionDebugPanel, { rawVideoEncoderBenchmarkRunner: rawRunner });

        await fireEvent.click(screen.getByRole('button', { name: /Media Compression Debug/ }));
        await fireEvent.click(screen.getByRole('button', { name: 'Run HTMLCanvas VideoEncoder benchmark' }));
        expect(rawRunner).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Raw benchmark: failed').textContent).toBe('Raw benchmark: failed');
        expect(document.querySelector('pre')?.textContent).toContain('failure: api-unavailable');
    });

    it('wires the manual decode file selection only for its fully gated diagnostic query', async () => {
        setSearch('?media-debug=1&media-debug-video-decode-benchmark=1');
        const decodeRunner = vi.fn().mockResolvedValue({
            status: 'completed',
            input: { mime: 'video/quicktime', size: 5, duration: 1, videoCodec: 'avc', displayWidth: 1080, displayHeight: 1920 },
            decode: { samplesDecoded: 1, firstSample: null, milestoneOffsets: { 1: 2 }, lastSampleOffset: 2 },
            timing: { inputTrackSetup: 1, decodeWall: 2, throughput: 500 },
        });
        render(MediaCompressionDebugPanel, { videoDecodeBenchmarkRunner: decodeRunner });

        await fireEvent.click(screen.getByRole('button', { name: /Media Compression Debug/ }));
        expect(screen.getByRole('button', { name: 'Run video decode benchmark' })).toBeDefined();
        const input = screen.getByLabelText('Select video for decode benchmark');
        await fireEvent.change(input, { target: { files: [new File(['video'], 'private.mov', { type: 'video/quicktime' })] } });
        expect(decodeRunner).toHaveBeenCalledTimes(1);
        expect(decodeRunner.mock.calls[0][0]).toBeInstanceOf(File);
        expect(screen.getByText('Video decode benchmark: completed').textContent).toBe('Video decode benchmark: completed');
        expect(document.querySelector('pre')?.textContent).toContain('Video Decode Benchmark #1');
        expect(document.querySelector('pre')?.textContent).not.toContain('private.mov');
    });

    it('returns the decode control to failed when the lazy benchmark import fails', async () => {
        setSearch('?media-debug=1&media-debug-video-decode-benchmark=1');
        const videoDecodeBenchmarkLoader = vi.fn().mockRejectedValue(new Error('benchmark chunk unavailable'));
        render(MediaCompressionDebugPanel, { videoDecodeBenchmarkLoader });

        await fireEvent.click(screen.getByRole('button', { name: /Media Compression Debug/ }));
        await fireEvent.change(screen.getByLabelText('Select video for decode benchmark'), {
            target: { files: [new File(['video'], 'private.mov', { type: 'video/quicktime' })] },
        });

        expect(videoDecodeBenchmarkLoader).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Video decode benchmark: failed').textContent).toBe('Video decode benchmark: failed');
    });
});
