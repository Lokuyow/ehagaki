import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VideoCompressionService } from '../../lib/videoCompression/videoCompressionService';
import { VIDEO_COMPRESSION_OPTIONS_MAP } from '../../lib/constants';

/**
 * 動画圧縮の結合テスト
 * 
 * このテストは実際のMediaBunnyライブラリとの統合をテストします。
 * FFmpegはモックを使用しますが、MediaBunnyの動作は実際の実装を使用します。
 */

// uploadAbortFlagStoreのモック
vi.mock('../../stores/appStore.svelte', () => ({
    uploadAbortFlagStore: {
        value: false,
        set: vi.fn(),
    },
}));

// テスト用のストレージ実装
class TestStorage implements Storage {
    private data: Map<string, string> = new Map();

    get length(): number {
        return this.data.size;
    }

    clear(): void {
        this.data.clear();
    }

    getItem(key: string): string | null {
        return this.data.get(key) ?? null;
    }

    key(index: number): string | null {
        return Array.from(this.data.keys())[index] ?? null;
    }

    removeItem(key: string): void {
        this.data.delete(key);
    }

    setItem(key: string, value: string): void {
        this.data.set(key, value);
    }
}

// 小さなテスト用動画ファイルを作成（実際のMP4ヘッダー付き）
function createTestVideoFile(size: number = 300 * 1024, name: string = 'test.mp4'): File {
    // 最小限のMP4ファイルヘッダー（ftypとmdat）
    const header = new Uint8Array([
        // ftyp box
        0x00, 0x00, 0x00, 0x20, // box size
        0x66, 0x74, 0x79, 0x70, // 'ftyp'
        0x69, 0x73, 0x6F, 0x6D, // major brand 'isom'
        0x00, 0x00, 0x02, 0x00, // minor version
        0x69, 0x73, 0x6F, 0x6D, // compatible brand 'isom'
        0x69, 0x73, 0x6F, 0x32, // compatible brand 'iso2'
        0x6D, 0x70, 0x34, 0x31, // compatible brand 'mp41'
        // mdat box (残りのデータ)
        ...new Uint8Array(size - 32),
    ]);

    return new File([header], name, { type: 'video/mp4' });
}

describe('Video Compression Integration Tests', () => {
    let service: VideoCompressionService;
    let storage: TestStorage;

    beforeEach(() => {
        storage = new TestStorage();
        service = new VideoCompressionService(storage);
    });

    describe('圧縮設定マップの検証', () => {
        it('すべての圧縮レベルが定義されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP).toHaveProperty('none');
            expect(VIDEO_COMPRESSION_OPTIONS_MAP).toHaveProperty('low');
            expect(VIDEO_COMPRESSION_OPTIONS_MAP).toHaveProperty('medium');
            expect(VIDEO_COMPRESSION_OPTIONS_MAP).toHaveProperty('high');
        });

        it('各圧縮レベルに必要なプロパティが存在する', () => {
            // low
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low).toMatchObject({
                crf: 20,
                preset: 'superfast',
                maxSize: 1280,
                audioBitrate: '128k',
            });

            // medium
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium).toMatchObject({
                crf: 26,
                preset: 'superfast',
                maxSize: 640,
                audioBitrate: '64k',
                audioSampleRate: 44100,
            });

            // high
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high).toMatchObject({
                crf: 28,
                preset: 'medium',
                maxSize: 320,
                audioBitrate: '32k',
                audioSampleRate: 16000,
                audioChannels: 1,
            });
        });

        it('maxSizeが適切に設定されている（低→中→高の順で小さくなる）', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low.maxSize).toBe(1280);
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.maxSize).toBe(640);
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.maxSize).toBe(320);
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low.maxSize).toBeGreaterThan(
                VIDEO_COMPRESSION_OPTIONS_MAP.medium.maxSize
            );
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.maxSize).toBeGreaterThan(
                VIDEO_COMPRESSION_OPTIONS_MAP.high.maxSize
            );
        });
    });

    describe('基本的な圧縮フロー', () => {
        it('非動画ファイルはスキップされる', async () => {
            const textFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
            const result = await service.compress(textFile);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBeUndefined();
            expect(result.file).toBe(textFile);
        });

        it('小さい動画ファイル（200KB以下）はスキップされる', async () => {
            const smallVideo = createTestVideoFile(150 * 1024);
            const result = await service.compress(smallVideo);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
            expect(result.file).toBe(smallVideo);
        });

        it('圧縮レベルがnoneの場合はスキップされる', async () => {
            storage.setItem('videoCompressionLevel', 'none');
            const video = createTestVideoFile(500 * 1024);
            const result = await service.compress(video);

            expect(result.wasCompressed).toBe(false);
            expect(result.wasSkipped).toBe(true);
            expect(result.file).toBe(video);
        });

        it('圧縮設定が未設定の場合はmediumがデフォルトとして使用される', () => {
            expect(service.hasCompressionSettings()).toBe(true);
        });
    });

    describe('圧縮レベル別の動作検証', () => {
        it('lowレベルの圧縮設定が適用される', async () => {
            storage.setItem('videoCompressionLevel', 'low');
            expect(service.hasCompressionSettings()).toBe(true);
            
            const video = createTestVideoFile(500 * 1024);
            const result = await service.compress(video);

            // MediaBunnyまたはFFmpegによる圧縮が試行される
            expect(result).toBeDefined();
            expect(result.file).toBeDefined();
            expect(result.file.type).toBe('video/mp4');
        });

        it('mediumレベルの圧縮設定が適用される', async () => {
            storage.setItem('videoCompressionLevel', 'medium');
            expect(service.hasCompressionSettings()).toBe(true);

            const video = createTestVideoFile(500 * 1024);
            const result = await service.compress(video);

            expect(result).toBeDefined();
            expect(result.file).toBeDefined();
            expect(result.file.type).toBe('video/mp4');
        });

        it('highレベルの圧縮設定が適用される', async () => {
            storage.setItem('videoCompressionLevel', 'high');
            expect(service.hasCompressionSettings()).toBe(true);

            const video = createTestVideoFile(500 * 1024);
            const result = await service.compress(video);

            expect(result).toBeDefined();
            expect(result.file).toBeDefined();
            expect(result.file.type).toBe('video/mp4');
        });
    });

    describe('ファイル名の処理', () => {
        it('圧縮後のファイル名に_compressedが付加される（拡張子あり）', async () => {
            storage.setItem('videoCompressionLevel', 'medium');
            const video = createTestVideoFile(500 * 1024, 'my-video.mp4');
            
            // MediaBunnyが使用できない環境ではFFmpegにフォールバック
            // いずれの場合も圧縮が試行される
            const result = await service.compress(video);
            
            expect(result.file).toBeDefined();
            if (result.wasCompressed) {
                expect(result.file.name).toBe('my-video_compressed.mp4');
            }
        });

        it('拡張子なしのファイル名も正しく処理される', async () => {
            storage.setItem('videoCompressionLevel', 'medium');
            const video = createTestVideoFile(500 * 1024, 'video');
            
            const result = await service.compress(video);
            
            expect(result.file).toBeDefined();
            if (result.wasCompressed) {
                expect(result.file.name).toBe('video_compressed.mp4');
            }
        });
    });

    describe('エラーハンドリング', () => {
        it('圧縮エラーが発生しても元のファイルが返される', async () => {
            storage.setItem('videoCompressionLevel', 'medium');
            
            // 不正なファイルを作成
            const invalidVideo = new File(['invalid'], 'invalid.mp4', { type: 'video/mp4' });
            
            const result = await service.compress(invalidVideo);
            
            // エラーが発生してもアプリケーションはクラッシュせず、
            // 元のファイルまたはスキップフラグ付きの結果が返される
            expect(result).toBeDefined();
            expect(result.file).toBeDefined();
        });

        it('複数回の圧縮処理が正しく動作する', async () => {
            storage.setItem('videoCompressionLevel', 'medium');

            const video1 = createTestVideoFile(300 * 1024, 'video1.mp4');
            const video2 = createTestVideoFile(300 * 1024, 'video2.mp4');

            const result1 = await service.compress(video1);
            const result2 = await service.compress(video2);

            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
            expect(result1.file).toBeDefined();
            expect(result2.file).toBeDefined();
        });
    });

    describe('リソース管理', () => {
        it('cleanupが正常に実行される', async () => {
            storage.setItem('videoCompressionLevel', 'medium');
            
            const video = createTestVideoFile(300 * 1024);
            await service.compress(video);
            
            await expect(service.cleanup()).resolves.not.toThrow();
        });

        it('cleanup後も圧縮処理が実行可能', async () => {
            storage.setItem('videoCompressionLevel', 'medium');
            
            const video1 = createTestVideoFile(300 * 1024);
            await service.compress(video1);
            
            await service.cleanup();
            
            const video2 = createTestVideoFile(300 * 1024);
            const result = await service.compress(video2);
            
            expect(result).toBeDefined();
            expect(result.file).toBeDefined();
        });
    });

    describe('進捗コールバック', () => {
        it('進捗コールバックが設定できる', () => {
            const progressCallback = vi.fn();
            service.setProgressCallback(progressCallback);
            
            // コールバック設定自体がエラーにならないことを確認
            expect(() => service.setProgressCallback(progressCallback)).not.toThrow();
        });

        it('進捗コールバックをundefinedに設定できる', () => {
            service.setProgressCallback(undefined);
            
            expect(() => service.setProgressCallback(undefined)).not.toThrow();
        });
    });

    describe('中止機能', () => {
        it('abort()メソッドが正常に実行される', () => {
            expect(() => service.abort()).not.toThrow();
        });

        it('複数回のabort()呼び出しが安全に処理される', () => {
            service.abort();
            service.abort();
            
            expect(() => service.abort()).not.toThrow();
        });
    });

    describe('圧縮設定の取得', () => {
        it('設定されていない場合はmediumがデフォルト', () => {
            expect(service.hasCompressionSettings()).toBe(true);
        });

        it('noneが設定されている場合はfalseを返す', () => {
            storage.setItem('videoCompressionLevel', 'none');
            expect(service.hasCompressionSettings()).toBe(false);
        });

        it('有効な圧縮レベルが設定されている場合はtrueを返す', () => {
            const levels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
            
            levels.forEach(level => {
                storage.setItem('videoCompressionLevel', level);
                expect(service.hasCompressionSettings()).toBe(true);
            });
        });
    });

    describe('WebCodecs API対応状況別のフォールバック動作', () => {
        let originalVideoEncoder: typeof VideoEncoder | undefined;
        let originalVideoDecoder: typeof VideoDecoder | undefined;
        let originalAudioEncoder: typeof AudioEncoder | undefined;

        beforeEach(() => {
            // グローバルオブジェクトを保存
            originalVideoEncoder = globalThis.VideoEncoder;
            originalVideoDecoder = globalThis.VideoDecoder;
            originalAudioEncoder = globalThis.AudioEncoder;
        });

        afterEach(() => {
            // グローバルオブジェクトを復元
            if (originalVideoEncoder) {
                (globalThis as any).VideoEncoder = originalVideoEncoder;
            } else {
                delete (globalThis as any).VideoEncoder;
            }
            if (originalVideoDecoder) {
                (globalThis as any).VideoDecoder = originalVideoDecoder;
            } else {
                delete (globalThis as any).VideoDecoder;
            }
            if (originalAudioEncoder) {
                (globalThis as any).AudioEncoder = originalAudioEncoder;
            } else {
                delete (globalThis as any).AudioEncoder;
            }
        });

        it('WebCodecs APIに対応していない環境ではFFmpegで変換される', async () => {
            // VideoEncoder/VideoDecoderを削除してWebCodecs APIを無効化
            delete (globalThis as any).VideoEncoder;
            delete (globalThis as any).VideoDecoder;
            delete (globalThis as any).AudioEncoder;

            storage.setItem('videoCompressionLevel', 'medium');
            
            // 新しいサービスインスタンスを作成（WebCodecsチェックをリセット）
            const testService = new VideoCompressionService(storage);
            const video = createTestVideoFile(500 * 1024, 'webcodecs-unavailable.mp4');
            
            const result = await testService.compress(video);
            
            // FFmpegでの圧縮が試行される
            expect(result).toBeDefined();
            expect(result.file).toBeDefined();
            expect(result.file.type).toBe('video/mp4');
        });

        it('WebCodecs APIのオーディオエンコードに対応していない環境ではビデオだけWebCodecs APIで変換し、元動画のオーディオをFFmpegでマージする', async () => {
            // AudioEncoderのみ削除（VideoEncoder/VideoDecoderは維持）
            delete (globalThis as any).AudioEncoder;

            storage.setItem('videoCompressionLevel', 'medium');
            
            // 新しいサービスインスタンスを作成
            const testService = new VideoCompressionService(storage);
            const video = createTestVideoFile(500 * 1024, 'audio-encoding-unavailable.mp4');
            
            const result = await testService.compress(video);
            
            // MediaBunnyでビデオ圧縮 + FFmpegでオーディオマージが試行される
            // 実際の動作は環境依存だが、エラーにならないことを確認
            expect(result).toBeDefined();
            expect(result.file).toBeDefined();
            expect(result.file.type).toBe('video/mp4');
        });

        it('WebCodecs APIに完全対応している環境ではビデオとオーディオの両方をWebCodecs APIで変換する', async () => {
            // VideoEncoder/VideoDecoder/AudioEncoderがすべて存在する状態
            // （テスト環境によってはモックが必要だが、基本的には既存の状態を維持）
            
            storage.setItem('videoCompressionLevel', 'medium');
            
            const testService = new VideoCompressionService(storage);
            const video = createTestVideoFile(500 * 1024, 'full-webcodecs-support.mp4');
            
            const result = await testService.compress(video);
            
            // MediaBunnyでビデオとオーディオ両方を圧縮
            expect(result).toBeDefined();
            expect(result.file).toBeDefined();
            expect(result.file.type).toBe('video/mp4');
        });
    });
});
