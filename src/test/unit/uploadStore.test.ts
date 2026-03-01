import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { abortAllUploads } from '../../stores/uploadStore.svelte';

describe('uploadStore', () => {
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
