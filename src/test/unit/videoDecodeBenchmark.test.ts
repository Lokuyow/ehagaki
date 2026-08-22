import { describe, expect, it, vi } from 'vitest';
import {
    runVideoDecodeBenchmark,
    type VideoDecodeBenchmarkInputLike,
    type VideoDecodeBenchmarkSampleLike,
    type VideoDecodeBenchmarkSinkLike,
    type VideoDecodeBenchmarkTrackLike,
} from '../../lib/videoCompression/videoDecodeBenchmark';

function createTrack(canDecode = true): VideoDecodeBenchmarkTrackLike {
    return {
        canDecode: vi.fn(async () => canDecode),
        getCodec: vi.fn(async () => 'avc'),
        getDisplayWidth: vi.fn(async () => 1080),
        getDisplayHeight: vi.fn(async () => 1920),
    };
}

function createInput(track: VideoDecodeBenchmarkTrackLike | undefined, dispose = vi.fn()): VideoDecodeBenchmarkInputLike {
    return {
        getVideoTracks: vi.fn(async () => track ? [track] : []),
        getDurationFromMetadata: vi.fn(async () => 20.9),
        dispose,
    };
}

function createSample() {
    return {
        format: 'NV12',
        codedWidth: 1080,
        codedHeight: 1920,
        displayWidth: 1080,
        displayHeight: 1920,
        close: vi.fn(),
    };
}

describe('runVideoDecodeBenchmark', () => {
    it('iterates decoded samples once, records only lightweight milestones, and closes every sample', async () => {
        const samples = Array.from({ length: 100 }, () => createSample());
        const track = createTrack();
        const dispose = vi.fn();
        let time = 0;
        const sink: VideoDecodeBenchmarkSinkLike = {
            async *samples() {
                for (const [index, sample] of samples.entries()) {
                    time = index + 1;
                    yield sample;
                }
                time = 101;
            },
        };

        const result = await runVideoDecodeBenchmark(new File(['video'], 'ignored.mov', { type: 'video/quicktime' }), {
            now: () => time,
            createInput: () => createInput(track, dispose),
            createVideoSampleSink: (sinkTrack) => {
                expect(sinkTrack).toBe(track);
                return sink;
            },
        });

        expect(result).toMatchObject({
            status: 'completed',
            input: {
                mime: 'video/quicktime', size: 5, duration: 20.9, videoCodec: 'avc', displayWidth: 1080, displayHeight: 1920,
            },
            decode: {
                samplesDecoded: 100,
                firstSample: { format: 'NV12', codedWidth: 1080, codedHeight: 1920, displayWidth: 1080, displayHeight: 1920 },
                milestoneOffsets: { 1: 1, 100: 100 },
                lastSampleOffset: 100,
            },
            timing: { decodeWall: 101, throughput: 100 / 0.101 },
        });
        expect(result.decode.milestoneOffsets[300]).toBeUndefined();
        expect(samples.every((sample) => sample.close.mock.calls.length === 1)).toBe(true);
        expect(result.decode).not.toHaveProperty('samples');
        expect(dispose).toHaveBeenCalledTimes(1);
    });

    it('returns a clear failure without creating a sample sink when there is no video track', async () => {
        const createVideoSampleSink = vi.fn();
        const result = await runVideoDecodeBenchmark(new File(['x'], 'ignored.mov', { type: 'video/quicktime' }), {
            createInput: () => createInput(undefined),
            createVideoSampleSink,
        });

        expect(result).toMatchObject({ status: 'failed', failure: { stage: 'no-video-track' } });
        expect(createVideoSampleSink).not.toHaveBeenCalled();
    });

    it('distinguishes an unavailable decoder before sample iteration', async () => {
        const createVideoSampleSink = vi.fn();
        const result = await runVideoDecodeBenchmark(new File(['x'], 'ignored.mov', { type: 'video/quicktime' }), {
            createInput: () => createInput(createTrack(false)),
            createVideoSampleSink,
        });

        expect(result).toMatchObject({ status: 'failed', failure: { stage: 'decoder-unavailable' } });
        expect(createVideoSampleSink).not.toHaveBeenCalled();
    });

    it('closes samples already received when decoding fails', async () => {
        const sample = createSample();
        const dispose = vi.fn();
        const result = await runVideoDecodeBenchmark(new File(['x'], 'ignored.mov', { type: 'video/quicktime' }), {
            createInput: () => createInput(createTrack(), dispose),
            createVideoSampleSink: () => ({
                async *samples() {
                    yield sample;
                    throw new Error('decode stopped');
                },
            }),
        });

        expect(result).toMatchObject({ status: 'failed', decode: { samplesDecoded: 1 }, failure: { stage: 'decode-failure' } });
        expect(sample.close).toHaveBeenCalledTimes(1);
        expect(dispose).toHaveBeenCalledTimes(1);
    });

    it('aborts safely, disposes the input, and closes the sample delivered before cancellation', async () => {
        const controller = new AbortController();
        const sample = createSample();
        const dispose = vi.fn();
        const result = await runVideoDecodeBenchmark(new File(['x'], 'ignored.mov', { type: 'video/quicktime' }), {
            signal: controller.signal,
            createInput: () => createInput(createTrack(), dispose),
            createVideoSampleSink: () => ({
                async *samples() {
                    yield sample;
                    controller.abort();
                },
            }),
        });

        expect(result).toMatchObject({ status: 'failed', failure: { stage: 'aborted' } });
        expect(sample.close).toHaveBeenCalledTimes(1);
        expect(dispose).toHaveBeenCalledTimes(1);
    });
});
