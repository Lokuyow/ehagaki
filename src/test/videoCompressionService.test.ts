import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VideoCompressionService, VIDEO_COMPRESSION_OPTIONS_MAP } from '../lib/videoCompressionService';

// FFmpegのモックインスタンス（グローバルスコープ）
const mockFFmpegInstance = {
    on: vi.fn(),
    load: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockResolvedValue(new Uint8Array([0x00, 0x00, 0x00, 0x20])), // 小さいファイル
    deleteFile: vi.fn().mockResolvedValue(undefined),
    exec: vi.fn().mockResolvedValue(undefined),
};

// FFmpegのモック
vi.mock('@ffmpeg/ffmpeg', () => ({
    FFmpeg: vi.fn(() => mockFFmpegInstance),
}));

vi.mock('@ffmpeg/util', () => ({
    fetchFile: vi.fn(async (file: any) => {
        // Fileオブジェクトの場合はsizeを使ってUint8Arrayを返す
        if (file && typeof file === 'object' && 'size' in file) {
            return new Uint8Array(file.size);
        }
        return new Uint8Array(0);
    }),
}));

// --- モッククラス定義 ---
class MockStorage implements Storage {
    private store: Record<string, string> = {};

    get length() { return Object.keys(this.store).length; }

    getItem(key: string): string | null {
        return this.store[key] || null;
    }

    setItem(key: string, value: string): void {
        this.store[key] = value;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    clear(): void {
        this.store = {};
    }

    key(index: number): string | null {
        const keys = Object.keys(this.store);
        return keys[index] || null;
    }
}

// --- ヘルパー関数 ---
function createMockVideoFile(size: number = 5 * 1024 * 1024, name: string = 'test.mp4'): File {
    const buffer = new ArrayBuffer(size);
    return new File([buffer], name, { type: 'video/mp4' });
}

describe('VIDEO_COMPRESSION_OPTIONS_MAP', () => {
    it('should have correct compression levels', () => {
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.none).toEqual({ skip: true });
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.low).toHaveProperty('crf', 20);
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.low).toHaveProperty('preset', 'superfast');
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.low).toHaveProperty('maxSize', 1280);
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium).toHaveProperty('crf', 26);
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium).toHaveProperty('preset', 'superfast');
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium).toHaveProperty('maxSize', 640);
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.high).toHaveProperty('crf', 28);
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.high).toHaveProperty('preset', 'medium');
        expect(VIDEO_COMPRESSION_OPTIONS_MAP.high).toHaveProperty('maxSize', 320);
    });

});

describe('VideoCompressionService', () => {
    let service: VideoCompressionService;
    let mockStorage: MockStorage;

    beforeEach(() => {
        mockStorage = new MockStorage();
        service = new VideoCompressionService(mockStorage);
        vi.clearAllMocks();

        // デフォルトのモック動作をリセット
        mockFFmpegInstance.load.mockResolvedValue(undefined);
        mockFFmpegInstance.writeFile.mockResolvedValue(undefined);
        // 圧縮後は元のファイルより小さくなるように設定
        mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(1 * 1024 * 1024)); // 1MB
        mockFFmpegInstance.deleteFile.mockResolvedValue(undefined);
        mockFFmpegInstance.exec.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should create an instance', () => {
            expect(service).toBeInstanceOf(VideoCompressionService);
        });
    });

    describe('hasCompressionSettings', () => {
        it('should return true when compression level is set to low', () => {
            mockStorage.setItem('videoCompressionLevel', 'low');
            expect(service.hasCompressionSettings()).toBe(true);
        });

        it('should return true when compression level is set to medium', () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            expect(service.hasCompressionSettings()).toBe(true);
        });

        it('should return true when compression level is set to high', () => {
            mockStorage.setItem('videoCompressionLevel', 'high');
            expect(service.hasCompressionSettings()).toBe(true);
        });

        it('should return false when compression level is set to none', () => {
            mockStorage.setItem('videoCompressionLevel', 'none');
            expect(service.hasCompressionSettings()).toBe(false);
        });

        it('should return true when no compression level is set (defaults to medium)', () => {
            expect(service.hasCompressionSettings()).toBe(true);
        });
    });

    describe('compress', () => {
        it('should skip compression for non-video files', async () => {
            const file = new File(['test'], 'test.txt', { type: 'text/plain' });
            const result = await service.compress(file);

            expect(result.wasCompressed).toBe(false);
            expect(result.file).toBe(file);
        });

        it('should skip compression for small video files (< 1MB)', async () => {
            const smallFile = createMockVideoFile(500 * 1024); // 500KB
            const result = await service.compress(smallFile);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
            expect(result.file).toBe(smallFile);
        });

        it('should skip compression when compression level is set to none', async () => {
            mockStorage.setItem('videoCompressionLevel', 'none');
            const file = createMockVideoFile();
            const result = await service.compress(file);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
            expect(result.file).toBe(file);
        });

        it('should compress video file with low compression settings', async () => {
            mockStorage.setItem('videoCompressionLevel', 'low');
            const file = createMockVideoFile(5 * 1024 * 1024, 'test.mp4'); // 5MB
            // 圧縮後のファイルは2MBになるようモック設定
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const result = await service.compress(file);

            expect(result.wasCompressed).toBe(true);
            expect(result.file.name).toBe('test_compressed.mp4');
            expect(result.file.type).toBe('video/mp4');
            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
        });

        it('should compress video file with medium compression settings', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            const file = createMockVideoFile(5 * 1024 * 1024, 'test.mp4');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const result = await service.compress(file);

            expect(result.wasCompressed).toBe(true);
            expect(result.file.name).toBe('test_compressed.mp4');
            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
        });

        it('should compress video file with high compression settings', async () => {
            mockStorage.setItem('videoCompressionLevel', 'high');
            const file = createMockVideoFile(5 * 1024 * 1024, 'test.mp4');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const result = await service.compress(file);

            expect(result.wasCompressed).toBe(true);
            expect(result.file.name).toBe('test_compressed.mp4');
            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
        });

        it('should use original file if compressed size is larger', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            // モックを変更して大きいファイルを返すようにする
            mockFFmpegInstance.readFile.mockResolvedValue(
                new Uint8Array(10 * 1024 * 1024) // 元のファイルより大きい
            );

            const file = createMockVideoFile(5 * 1024 * 1024);
            const result = await service.compress(file);

            expect(result.wasCompressed).toBe(false);
            expect(result.file).toBe(file);
        });

        it('should handle compression errors gracefully', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.exec.mockRejectedValue(new Error('FFmpeg error'));

            const file = createMockVideoFile();
            const result = await service.compress(file);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
            expect(result.file).toBe(file);
        });

        it('should preserve file extension when compressing', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile(5 * 1024 * 1024, 'my-video.mp4');
            const result = await service.compress(file);

            expect(result.file.name).toBe('my-video_compressed.mp4');
        });

        it('should handle file names without extension', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const buffer = new ArrayBuffer(5 * 1024 * 1024);
            const file = new File([buffer], 'video', { type: 'video/mp4' });
            const result = await service.compress(file);

            expect(result.file.name).toBe('video_compressed.mp4');
        });
    });

    describe('cleanup', () => {
        it('should cleanup resources', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            await service.cleanup();

            // クリーンアップ後は再圧縮時に再ロードが必要
            const result = await service.compress(file);
            expect(result).toBeDefined();
            // 再ロードされたか確認 (最初のload + cleanup後のload = 2回)
            expect(mockFFmpegInstance.load).toHaveBeenCalledTimes(2);
        });

        it('should handle cleanup errors gracefully', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            // クリーンアップ自体はエラーをスローしない
            await expect(service.cleanup()).resolves.not.toThrow();
        });
    });

    describe('FFmpeg loading', () => {
        it('should load FFmpeg only once', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file1 = createMockVideoFile();
            const file2 = createMockVideoFile();

            await service.compress(file1);
            await service.compress(file2);

            // FFmpegは1回だけロードされるべき
            expect(mockFFmpegInstance.load).toHaveBeenCalledTimes(1);
        });

        it('should handle FFmpeg load failure', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.load.mockRejectedValue(new Error('Load failed'));

            const file = createMockVideoFile();
            const result = await service.compress(file);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
        });
    });

    describe('compression with scale filter', () => {
        it('should apply scale filter for low compression (1280px)', async () => {
            mockStorage.setItem('videoCompressionLevel', 'low');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            // execが呼ばれた引数を確認
            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
            const callArgs = mockFFmpegInstance.exec.mock.calls[0][0];
            expect(callArgs).toContain('-vf');
            const vfIndex = callArgs.indexOf('-vf');
            expect(callArgs[vfIndex + 1]).toContain('1280');
        });

        it('should apply scale filter for medium compression (640px)', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
            const callArgs = mockFFmpegInstance.exec.mock.calls[0][0];
            expect(callArgs).toContain('-vf');
            const vfIndex = callArgs.indexOf('-vf');
            expect(callArgs[vfIndex + 1]).toContain('640');
        });

        it('should apply scale filter for high compression (320px)', async () => {
            mockStorage.setItem('videoCompressionLevel', 'high');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
            const callArgs = mockFFmpegInstance.exec.mock.calls[0][0];
            expect(callArgs).toContain('-vf');
            const vfIndex = callArgs.indexOf('-vf');
            expect(callArgs[vfIndex + 1]).toContain('320');
        });
    });

    describe('FFmpeg arguments', () => {
        it('should use correct CRF value for low compression', async () => {
            mockStorage.setItem('videoCompressionLevel', 'low');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
            const callArgs = mockFFmpegInstance.exec.mock.calls[0][0];
            const crfIndex = callArgs.indexOf('-crf');
            expect(callArgs[crfIndex + 1]).toBe('20');
        });

        it('should use correct preset for low compression', async () => {
            mockStorage.setItem('videoCompressionLevel', 'low');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
            const callArgs = mockFFmpegInstance.exec.mock.calls[0][0];
            const presetIndex = callArgs.indexOf('-preset');
            expect(callArgs[presetIndex + 1]).toBe('superfast');
        });

        it('should use AAC audio codec with 128k bitrate', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
            const callArgs = mockFFmpegInstance.exec.mock.calls[0][0];
            expect(callArgs).toContain('-c:a');
            expect(callArgs).toContain('aac');
            expect(callArgs).toContain('-b:a');
            expect(callArgs).toContain('128k');
        });

        it('should use faststart for streaming', async () => {
            mockStorage.setItem('videoCompressionLevel', 'medium');
            mockFFmpegInstance.readFile.mockResolvedValue(new Uint8Array(2 * 1024 * 1024));

            const file = createMockVideoFile();
            await service.compress(file);

            expect(mockFFmpegInstance.exec).toHaveBeenCalled();
            const callArgs = mockFFmpegInstance.exec.mock.calls[0][0];
            expect(callArgs).toContain('-movflags');
            expect(callArgs).toContain('+faststart');
        });
    });
});
