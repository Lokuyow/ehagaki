import { describe, expect, it } from 'vitest';
import {
    RAW_VIDEO_ENCODER_BENCHMARK_CONFIG,
    rawVideoEncoderTimestampForFrame,
    runRawVideoEncoderBenchmark,
    type RawVideoEncoderConstructor,
} from '../../lib/videoCompression/rawVideoEncoderBenchmark';

class FakeEncoder extends EventTarget {
    static supported = true;
    static configureCalls = 0;
    static supportConfigs: VideoEncoderConfig[] = [];
    static configureConfigs: VideoEncoderConfig[] = [];
    static closeCalls = 0;
    static flushCalls = 0;
    static mode: 'success' | 'encode-failure' | 'flush-failure' = 'success';
    static frames: Array<{ timestamp: number; closed: boolean }> = [];
    static maxQueueSize = 0;

    encodeQueueSize = 0;
    private readonly output: (chunk: { byteLength: number; type: 'key' | 'delta' }) => void;

    constructor(init: { output: (chunk: { byteLength: number; type: 'key' | 'delta' }) => void }) {
        super();
        this.output = init.output;
    }

    static async isConfigSupported(config: VideoEncoderConfig): Promise<{ supported: boolean; config: VideoEncoderConfig }> {
        FakeEncoder.supportConfigs.push({ ...config });
        return { supported: FakeEncoder.supported, config };
    }

    configure(config: VideoEncoderConfig): void {
        FakeEncoder.configureCalls += 1;
        FakeEncoder.configureConfigs.push({ ...config });
    }

    encode(frame: { timestamp: number; closed: boolean; close(): void }): void {
        if (FakeEncoder.mode === 'encode-failure') throw new Error('encode failed');
        this.encodeQueueSize += 1;
        FakeEncoder.maxQueueSize = Math.max(FakeEncoder.maxQueueSize, this.encodeQueueSize);
        FakeEncoder.frames.push(frame);
        this.output({ byteLength: 80, type: FakeEncoder.frames.length === 1 ? 'key' : 'delta' });
        queueMicrotask(() => {
            this.encodeQueueSize -= 1;
            this.dispatchEvent(new Event('dequeue'));
        });
    }

    async flush(): Promise<void> {
        FakeEncoder.flushCalls += 1;
        if (FakeEncoder.mode === 'flush-failure') throw new Error('flush failed');
    }

    close(): void {
        FakeEncoder.closeCalls += 1;
    }

    static reset(): void {
        FakeEncoder.supported = true;
        FakeEncoder.configureCalls = 0;
        FakeEncoder.supportConfigs = [];
        FakeEncoder.configureConfigs = [];
        FakeEncoder.closeCalls = 0;
        FakeEncoder.flushCalls = 0;
        FakeEncoder.mode = 'success';
        FakeEncoder.frames = [];
        FakeEncoder.maxQueueSize = 0;
    }
}

function createFrame(_index: number, timestamp: number): { timestamp: number; closed: boolean; close(): void } {
    return {
        timestamp,
        closed: false,
        close() {
            this.closed = true;
        },
    };
}

describe('raw VideoEncoder benchmark', () => {
    it('uses fixed AVC configuration and one-at-a-time frames without retaining them', async () => {
        FakeEncoder.reset();
        const result = await runRawVideoEncoderBenchmark({
            VideoEncoder: FakeEncoder as unknown as RawVideoEncoderConstructor,
            createFrame,
            frameCount: 5,
            queueLimit: 2,
        });

        expect(result).toMatchObject({
            status: 'completed',
            config: RAW_VIDEO_ENCODER_BENCHMARK_CONFIG,
            frameCount: 5,
            queueLimit: 2,
            framesSubmitted: 5,
            chunks: 5,
            bytes: 400,
            keyChunks: 1,
            deltaChunks: 4,
        });
        expect(RAW_VIDEO_ENCODER_BENCHMARK_CONFIG.codec).toBe('avc1.64001E');
        expect(FakeEncoder.supportConfigs).toEqual([RAW_VIDEO_ENCODER_BENCHMARK_CONFIG]);
        expect(FakeEncoder.configureConfigs).toEqual([RAW_VIDEO_ENCODER_BENCHMARK_CONFIG]);
        expect(result.throughput).toBeGreaterThan(0);
        expect(FakeEncoder.configureCalls).toBe(1);
        expect(FakeEncoder.flushCalls).toBe(1);
        expect(FakeEncoder.closeCalls).toBe(1);
        expect(FakeEncoder.maxQueueSize).toBeLessThanOrEqual(2);
        expect(FakeEncoder.frames).toHaveLength(5);
        expect(FakeEncoder.frames.every((frame) => frame.closed)).toBe(true);
        expect(FakeEncoder.frames.map((frame) => frame.timestamp)).toEqual([0, 33333, 66667, 100000, 133333]);
    });

    it('creates monotonic microsecond timestamps at 30 fps', () => {
        const timestamps = Array.from({ length: 627 }, (_, frameIndex) => rawVideoEncoderTimestampForFrame(frameIndex));
        expect(timestamps[0]).toBe(0);
        expect(timestamps.every((timestamp, index) => index === 0 || timestamp > timestamps[index - 1]!)).toBe(true);
        expect(timestamps.at(-1)).toBe(20_866_667);
    });

    it('reports unavailable and unsupported APIs without configuring or encoding', async () => {
        const unavailable = await runRawVideoEncoderBenchmark({
            VideoEncoder: null,
            VideoFrame: null,
        });
        expect(unavailable.failure?.stage).toBe('api-unavailable');

        FakeEncoder.reset();
        FakeEncoder.supported = false;
        const unsupported = await runRawVideoEncoderBenchmark({
            VideoEncoder: FakeEncoder as unknown as RawVideoEncoderConstructor,
            createFrame,
        });
        expect(unsupported.failure?.stage).toBe('config-unsupported');
        expect(FakeEncoder.configureCalls).toBe(0);
        expect(FakeEncoder.frames).toHaveLength(0);
    });

    it.each([
        ['encode-failure', 'encode-failure'],
        ['flush-failure', 'flush-failure'],
    ] as const)('closes frames and the encoder after %s', async (mode, expectedStage) => {
        FakeEncoder.reset();
        FakeEncoder.mode = mode;
        const createdFrames: Array<{ timestamp: number; closed: boolean; close(): void }> = [];
        const result = await runRawVideoEncoderBenchmark({
            VideoEncoder: FakeEncoder as unknown as RawVideoEncoderConstructor,
            createFrame: (index, timestamp) => {
                const frame = createFrame(index, timestamp);
                createdFrames.push(frame);
                return frame;
            },
            frameCount: 3,
        });

        expect(result.status).toBe('failed');
        expect(result.failure?.stage).toBe(expectedStage);
        expect(FakeEncoder.closeCalls).toBe(1);
        expect(createdFrames.every((frame) => frame.closed)).toBe(true);
    });
});
