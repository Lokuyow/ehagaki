import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageCompressionService } from '../../lib/imageCompressionService';
import type { MimeTypeSupportInterface } from '../../lib/types';
import { MockStorage } from '../helpers';

/**
 * ImageCompressionService ユニットテスト
 *
 * browser-image-compressionをモックし、圧縮分岐ロジックを網羅的に検証。
 * DI設計（mimeSupport + localStorage注入）を活用したテスト。
 */

// browser-image-compressionのモック
vi.mock('browser-image-compression', () => ({
    default: vi.fn()
}));

// debug.tsのモック（setup.tsより具体的なモックで上書き）
vi.mock('../../lib/debug', () => ({
    debugLog: vi.fn(),
    showCompressedImagePreview: vi.fn()
}));

function createMockMimeSupport(webpSupported = true): MimeTypeSupportInterface {
    return {
        canEncodeWebpWithQuality: vi.fn().mockResolvedValue(webpSupported),
        canEncodeMimeType: vi.fn().mockReturnValue(true)
    };
}

function createTestFile(name: string, type: string, sizeBytes: number): File {
    const content = new Uint8Array(sizeBytes);
    return new File([content], name, { type });
}

describe('ImageCompressionService', () => {
    let service: ImageCompressionService;
    let mockMimeSupport: MimeTypeSupportInterface;
    let mockStorage: MockStorage;
    let imageCompressionMock: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        vi.clearAllMocks();
        mockMimeSupport = createMockMimeSupport();
        mockStorage = new MockStorage();
        mockStorage.setItem('imageCompressionLevel', 'medium');
        service = new ImageCompressionService(mockMimeSupport, mockStorage);

        // browser-image-compressionモックを取得
        const mod = await import('browser-image-compression');
        imageCompressionMock = vi.mocked(mod.default);
    });

    describe('hasCompressionSettings', () => {
        it('圧縮レベルがnone以外の場合はtrueを返す', () => {
            mockStorage.setItem('imageCompressionLevel', 'medium');
            service = new ImageCompressionService(mockMimeSupport, mockStorage);
            expect(service.hasCompressionSettings()).toBe(true);
        });

        it('圧縮レベルがlowの場合はtrueを返す', () => {
            mockStorage.setItem('imageCompressionLevel', 'low');
            service = new ImageCompressionService(mockMimeSupport, mockStorage);
            expect(service.hasCompressionSettings()).toBe(true);
        });

        it('圧縮レベルがhighの場合はtrueを返す', () => {
            mockStorage.setItem('imageCompressionLevel', 'high');
            service = new ImageCompressionService(mockMimeSupport, mockStorage);
            expect(service.hasCompressionSettings()).toBe(true);
        });

        it('圧縮レベルがnoneの場合はfalseを返す', () => {
            mockStorage.setItem('imageCompressionLevel', 'none');
            service = new ImageCompressionService(mockMimeSupport, mockStorage);
            expect(service.hasCompressionSettings()).toBe(false);
        });

        it('圧縮レベルが未設定の場合はmediumがデフォルトでtrueを返す', () => {
            mockStorage.clear();
            service = new ImageCompressionService(mockMimeSupport, mockStorage);
            expect(service.hasCompressionSettings()).toBe(true);
        });
    });

    describe('compress', () => {
        describe('画像以外のファイル', () => {
            it('テキストファイルは圧縮しない', async () => {
                const file = createTestFile('doc.txt', 'text/plain', 50000);
                const result = await service.compress(file);

                expect(result.wasCompressed).toBe(false);
                expect(result.file).toBe(file);
                expect(imageCompressionMock).not.toHaveBeenCalled();
            });

            it('動画ファイルは圧縮しない', async () => {
                const file = createTestFile('video.mp4', 'video/mp4', 1000000);
                const result = await service.compress(file);

                expect(result.wasCompressed).toBe(false);
                expect(result.file).toBe(file);
            });
        });

        describe('小さい画像のスキップ', () => {
            it('20KB以下の画像は圧縮をスキップする', async () => {
                const file = createTestFile('small.jpg', 'image/jpeg', 20 * 1024);
                const result = await service.compress(file);

                expect(result.wasCompressed).toBe(false);
                expect(result.wasSkipped).toBe(true);
                expect(imageCompressionMock).not.toHaveBeenCalled();
            });

            it('20KBちょうどの画像は圧縮をスキップする', async () => {
                const file = createTestFile('small.jpg', 'image/jpeg', 20 * 1024);
                const result = await service.compress(file);

                expect(result.wasSkipped).toBe(true);
            });

            it('20KBを超える画像は圧縮を試行する', async () => {
                const file = createTestFile('large.jpg', 'image/jpeg', 20 * 1024 + 1);
                const compressedContent = new Uint8Array(10000);
                const compressedFile = new File([compressedContent], 'large.jpg', { type: 'image/webp' });
                imageCompressionMock.mockResolvedValue(compressedFile);

                const result = await service.compress(file);
                expect(imageCompressionMock).toHaveBeenCalled();
            });
        });

        describe('圧縮設定がnoneの場合', () => {
            it('圧縮をスキップする', async () => {
                mockStorage.setItem('imageCompressionLevel', 'none');
                service = new ImageCompressionService(mockMimeSupport, mockStorage);

                const file = createTestFile('photo.jpg', 'image/jpeg', 500000);
                const result = await service.compress(file);

                expect(result.wasCompressed).toBe(false);
                expect(result.wasSkipped).toBe(true);
                expect(imageCompressionMock).not.toHaveBeenCalled();
            });
        });

        describe('正常な圧縮', () => {
            it('圧縮後のファイルが小さい場合は圧縮済みファイルを返す', async () => {
                const file = createTestFile('photo.jpg', 'image/jpeg', 500000);
                const compressedContent = new Uint8Array(100000);
                const compressedFile = new File([compressedContent], 'photo.webp', { type: 'image/webp' });
                imageCompressionMock.mockResolvedValue(compressedFile);

                const result = await service.compress(file);

                expect(result.wasCompressed).toBe(true);
                expect(result.file.size).toBeLessThan(file.size);
            });

            it('圧縮後のファイルが元より大きい場合は元のファイルを返す', async () => {
                const file = createTestFile('photo.jpg', 'image/jpeg', 50000);
                const compressedContent = new Uint8Array(60000);
                const compressedFile = new File([compressedContent], 'photo.webp', { type: 'image/webp' });
                imageCompressionMock.mockResolvedValue(compressedFile);

                const result = await service.compress(file);

                expect(result.wasCompressed).toBe(false);
                expect(result.file).toBe(file);
            });

            it('圧縮後のファイルが同じサイズの場合は元のファイルを返す', async () => {
                const file = createTestFile('photo.jpg', 'image/jpeg', 50000);
                const compressedContent = new Uint8Array(50000);
                const compressedFile = new File([compressedContent], 'photo.webp', { type: 'image/webp' });
                imageCompressionMock.mockResolvedValue(compressedFile);

                const result = await service.compress(file);

                expect(result.wasCompressed).toBe(false);
                expect(result.file).toBe(file);
            });
        });

        describe('WebPサポート判定', () => {
            it('WebPがサポートされない場合はPNG画像にはPNGを使用する', async () => {
                mockMimeSupport = createMockMimeSupport(false);
                service = new ImageCompressionService(mockMimeSupport, mockStorage);

                const file = createTestFile('photo.png', 'image/png', 500000);
                const compressedContent = new Uint8Array(100000);
                const compressedFile = new File([compressedContent], 'photo.png', { type: 'image/png' });
                imageCompressionMock.mockResolvedValue(compressedFile);

                await service.compress(file);

                // canEncodeWebpWithQualityが呼ばれたことを確認
                expect(mockMimeSupport.canEncodeWebpWithQuality).toHaveBeenCalled();
                // 圧縮オプションのfileTypeがPNGに変更されていることを確認
                const callArgs = imageCompressionMock.mock.calls[0];
                expect(callArgs[1].fileType).toBe('image/png');
            });

            it('WebPがサポートされない場合はJPEG画像にはJPEGを使用する', async () => {
                mockMimeSupport = createMockMimeSupport(false);
                service = new ImageCompressionService(mockMimeSupport, mockStorage);

                const file = createTestFile('photo.jpg', 'image/jpeg', 500000);
                const compressedContent = new Uint8Array(100000);
                const compressedFile = new File([compressedContent], 'photo.jpg', { type: 'image/jpeg' });
                imageCompressionMock.mockResolvedValue(compressedFile);

                await service.compress(file);

                const callArgs = imageCompressionMock.mock.calls[0];
                expect(callArgs[1].fileType).toBe('image/jpeg');
            });

            it('WebPがサポートされる場合はWebPを使用する', async () => {
                mockMimeSupport = createMockMimeSupport(true);
                service = new ImageCompressionService(mockMimeSupport, mockStorage);

                const file = createTestFile('photo.jpg', 'image/jpeg', 500000);
                const compressedContent = new Uint8Array(100000);
                const compressedFile = new File([compressedContent], 'photo.webp', { type: 'image/webp' });
                imageCompressionMock.mockResolvedValue(compressedFile);

                await service.compress(file);

                const callArgs = imageCompressionMock.mock.calls[0];
                expect(callArgs[1].fileType).toBe('image/webp');
            });
        });

        describe('MIMEタイプエンコードサポート', () => {
            it('ターゲットMIMEタイプがエンコードできない場合は元のファイルタイプを使用する', async () => {
                vi.mocked(mockMimeSupport.canEncodeMimeType).mockReturnValue(false);
                service = new ImageCompressionService(mockMimeSupport, mockStorage);

                const file = createTestFile('photo.jpg', 'image/jpeg', 500000);
                const compressedContent = new Uint8Array(100000);
                const compressedFile = new File([compressedContent], 'photo.jpg', { type: 'image/jpeg' });
                imageCompressionMock.mockResolvedValue(compressedFile);

                await service.compress(file);

                const callArgs = imageCompressionMock.mock.calls[0];
                // fileTypeが削除されていること（元ファイルのMIMEを使用）
                expect(callArgs[1].fileType).toBeUndefined();
            });
        });

        describe('圧縮エラー', () => {
            it('圧縮が例外を投げた場合は元のファイルを返す', async () => {
                const file = createTestFile('photo.jpg', 'image/jpeg', 500000);
                imageCompressionMock.mockRejectedValue(new Error('Compression failed'));

                const result = await service.compress(file);

                expect(result.wasCompressed).toBe(false);
                expect(result.wasSkipped).toBe(true);
                expect(result.file).toBe(file);
            });
        });

        describe('中止フラグ', () => {
            it('圧縮開始前に中止フラグが立っている場合はaborted=trueを返す', async () => {
                // uploadAbortFlagStoreはsetup.tsでモックされている
                const { uploadAbortFlagStore } = await import('../../stores/appStore.svelte');
                (uploadAbortFlagStore as any).value = true;

                const file = createTestFile('photo.jpg', 'image/jpeg', 500000);
                const result = await service.compress(file);

                expect(result.aborted).toBe(true);
                expect(result.wasCompressed).toBe(false);
                expect(imageCompressionMock).not.toHaveBeenCalled();

                // クリーンアップ
                (uploadAbortFlagStore as any).value = false;
            });
        });
    });

    describe('setProgressCallback', () => {
        it('進捗コールバックを設定できる', () => {
            const callback = vi.fn();
            // setProgressCallbackが例外を投げないことを確認
            expect(() => service.setProgressCallback(callback)).not.toThrow();
        });
    });

    describe('abort', () => {
        it('abortが例外を投げない', () => {
            expect(() => service.abort()).not.toThrow();
        });

        it('進捗コールバック設定時にabortすると進捗が0にリセットされる', () => {
            const progressCallback = vi.fn();
            service.setProgressCallback(progressCallback);
            service.abort();
            expect(progressCallback).toHaveBeenCalledWith(0);
        });
    });
});
