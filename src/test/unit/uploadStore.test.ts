import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.unmock('../../stores/uploadStore.svelte');

// vi.mockは巧き上げされるため、内部で使う変数はvi.hoistedで宣言する
const { mockRemovePlaceholders, mockImageSizeMapUpdate } = vi.hoisted(() => ({
    mockRemovePlaceholders: vi.fn(() => [] as string[]),
    mockImageSizeMapUpdate: vi.fn(),
}));

// mediaGalleryStore をモック
vi.mock('../../stores/mediaGalleryStore.svelte', () => ({
    mediaGalleryStore: {
        removePlaceholders: mockRemovePlaceholders,
    },
}));

// tagsStore をモック
vi.mock('../../stores/tagsStore.svelte', () => ({
    imageSizeMapStore: {
        update: mockImageSizeMapUpdate,
    },
}));

import {
    abortAllUploads,
    setImageSizeInfoFromFileSize,
    setUploadProgress,
    uploadProgressStore,
    setSharedMediaError,
    sharedMediaErrorStore,
    resetUploadDisplayState,
    imageSizeInfoStore,
    videoCompressionProgressStore,
    imageCompressionProgressStore,
    isUploadingStore,
} from '../../stores/uploadStore.svelte';

describe('uploadStore', () => {
    beforeEach(() => {
        resetUploadDisplayState();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    describe('setUploadProgress()', () => {
        it('アップロード進捗と isUploadingStore を更新する', () => {
            setUploadProgress({
                total: 3,
                completed: 1,
                failed: 0,
                aborted: 0,
                inProgress: true,
            });

            expect(uploadProgressStore.value).toEqual({
                total: 3,
                completed: 1,
                failed: 0,
                aborted: 0,
                inProgress: true,
            });
            expect(isUploadingStore.value).toBe(true);
        });

        it('完了済み進捗は一定時間後に自動リセットされる', () => {
            setUploadProgress({
                total: 2,
                completed: 2,
                failed: 0,
                aborted: 0,
                inProgress: false,
            });

            expect(uploadProgressStore.value.total).toBe(2);

            vi.advanceTimersByTime(1000);

            expect(uploadProgressStore.value).toEqual({
                total: 0,
                completed: 0,
                failed: 0,
                aborted: 0,
                inProgress: false,
            });
            expect(isUploadingStore.value).toBe(false);
        });
    });

    describe('setSharedMediaError()', () => {
        it('指定時間後に共有メディアエラーをクリアする', () => {
            setSharedMediaError('共有エラー', 5000);

            expect(sharedMediaErrorStore.value).toBe('共有エラー');

            vi.advanceTimersByTime(5000);

            expect(sharedMediaErrorStore.value).toBeNull();
        });
    });

    describe('setImageSizeInfoFromFileSize()', () => {
        it('FileSizeInfo から表示用のサイズ情報を設定する', () => {
            setImageSizeInfoFromFileSize({
                originalSize: 2048,
                compressedSize: 1024,
                wasCompressed: true,
                compressionRatio: 50,
                sizeReduction: '2KB → 1KB',
                originalFilename: 'sample.png',
                compressedFilename: 'sample.webp',
                wasSkipped: false,
            });

            expect(imageSizeInfoStore.value).toEqual({
                info: {
                    wasCompressed: true,
                    originalSize: '2KB',
                    compressedSize: '1KB',
                    compressionRatio: 50,
                    originalFilename: 'sample.png',
                    compressedFilename: 'sample.webp',
                    wasSkipped: false,
                },
                visible: true,
            });
        });
    });

    describe('resetUploadDisplayState()', () => {
        it('imageSizeInfoOnly 指定時は画像サイズ情報だけをクリアする', () => {
            setUploadProgress({
                total: 1,
                completed: 0,
                failed: 0,
                aborted: 0,
                inProgress: true,
            });
            imageSizeInfoStore.set({
                info: {
                    wasCompressed: true,
                    originalSize: '10MB',
                    compressedSize: '5MB',
                    compressionRatio: 50,
                },
                visible: true,
            });

            resetUploadDisplayState({ imageSizeInfoOnly: true });

            expect(imageSizeInfoStore.value).toEqual({ info: null, visible: false });
            expect(uploadProgressStore.value.inProgress).toBe(true);
        });

        it('進捗・圧縮・共有エラーをまとめてクリアする', () => {
            setUploadProgress({
                total: 1,
                completed: 0,
                failed: 0,
                aborted: 0,
                inProgress: true,
            });
            setSharedMediaError('共有エラー');
            videoCompressionProgressStore.set(44);
            imageCompressionProgressStore.set(55);

            resetUploadDisplayState();

            expect(uploadProgressStore.value).toEqual({
                total: 0,
                completed: 0,
                failed: 0,
                aborted: 0,
                inProgress: false,
            });
            expect(sharedMediaErrorStore.value).toBeNull();
            expect(videoCompressionProgressStore.value).toBe(0);
            expect(imageCompressionProgressStore.value).toBe(0);
        });
    });

    describe('abortAllUploads()', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            mockRemovePlaceholders.mockReturnValue([]);
        });

        it('mediaGalleryStore.removePlaceholders() を呼び出す', () => {
            abortAllUploads();

            expect(mockRemovePlaceholders).toHaveBeenCalledOnce();
        });

        it('削除されたプレースホルダーIDを imageSizeMapStore から削除する', () => {
            mockRemovePlaceholders.mockReturnValue(['ph-1', 'ph-2']);

            abortAllUploads();

            expect(mockImageSizeMapUpdate).toHaveBeenCalledOnce();

            // update に渡された関数が正しくIDを除去するか検証
            const updateFn: (map: Record<string, unknown>) => Record<string, unknown> =
                mockImageSizeMapUpdate.mock.calls[0][0];

            const input = {
                'ph-1': { width: 100, height: 100 },
                'ph-2': { width: 200, height: 200 },
                'img-keep': { width: 50, height: 50 },
            };
            const result = updateFn(input);

            expect(result).toEqual({ 'img-keep': { width: 50, height: 50 } });
            expect(result).not.toHaveProperty('ph-1');
            expect(result).not.toHaveProperty('ph-2');
        });

        it('プレースホルダーが存在しない場合は imageSizeMapStore.update を呼ばない', () => {
            mockRemovePlaceholders.mockReturnValue([]);

            abortAllUploads();

            expect(mockImageSizeMapUpdate).not.toHaveBeenCalled();
        });

        it('プレースホルダーが1件のみの場合も正しくクリーンアップする', () => {
            mockRemovePlaceholders.mockReturnValue(['ph-only']);

            abortAllUploads();

            expect(mockImageSizeMapUpdate).toHaveBeenCalledOnce();
            const updateFn: (map: Record<string, unknown>) => Record<string, unknown> =
                mockImageSizeMapUpdate.mock.calls[0][0];

            const result = updateFn({ 'ph-only': { width: 10, height: 10 }, 'keep': {} });
            expect(result).toEqual({ 'keep': {} });
        });
    });
});
