import { describe, it, expect, vi, beforeEach } from 'vitest';

// setup.ts の $state mock は配列を { ...[] } = {} に変換してしまうため、
// vi.hoisted でモジュールインポート前に $state を上書きする
vi.hoisted(() => {
    (globalThis as any).$state = (initialValue: any) => initialValue;
});

import type { MediaGalleryItem } from '../../lib/types';
import { mediaGalleryStore } from '../../stores/mediaGalleryStore.svelte';

// テスト用ファクトリー
function makeItem(id: string, isPlaceholder: boolean): MediaGalleryItem {
    return {
        id,
        type: 'image',
        src: isPlaceholder ? '' : `https://example.com/${id}.jpg`,
        isPlaceholder,
    };
}

describe('mediaGalleryStore', () => {
    beforeEach(() => {
        mediaGalleryStore.clearAll();
    });

    describe('removePlaceholders()', () => {
        it('プレースホルダーのみを削除し、それ以外は残す', () => {
            mediaGalleryStore.addItem(makeItem('ph-1', true));
            mediaGalleryStore.addItem(makeItem('img-1', false));
            mediaGalleryStore.addItem(makeItem('ph-2', true));

            mediaGalleryStore.removePlaceholders();

            expect(mediaGalleryStore.items).toHaveLength(1);
            expect(mediaGalleryStore.items[0].id).toBe('img-1');
        });

        it('削除したプレースホルダーのID配列を返す', () => {
            mediaGalleryStore.addItem(makeItem('ph-1', true));
            mediaGalleryStore.addItem(makeItem('img-1', false));
            mediaGalleryStore.addItem(makeItem('ph-2', true));

            const removed = mediaGalleryStore.removePlaceholders();

            expect(removed).toEqual(['ph-1', 'ph-2']);
        });

        it('プレースホルダーが存在しない場合は空配列を返し、アイテムは変化しない', () => {
            mediaGalleryStore.addItem(makeItem('img-1', false));
            mediaGalleryStore.addItem(makeItem('img-2', false));

            const removed = mediaGalleryStore.removePlaceholders();

            expect(removed).toEqual([]);
            expect(mediaGalleryStore.items).toHaveLength(2);
        });

        it('ストアが空の場合は空配列を返す', () => {
            const removed = mediaGalleryStore.removePlaceholders();

            expect(removed).toEqual([]);
            expect(mediaGalleryStore.items).toHaveLength(0);
        });

        it('全アイテムがプレースホルダーの場合、全て削除されストアが空になる', () => {
            mediaGalleryStore.addItem(makeItem('ph-1', true));
            mediaGalleryStore.addItem(makeItem('ph-2', true));
            mediaGalleryStore.addItem(makeItem('ph-3', true));

            const removed = mediaGalleryStore.removePlaceholders();

            expect(removed).toHaveLength(3);
            expect(mediaGalleryStore.items).toHaveLength(0);
        });

        it('削除後も非プレースホルダーアイテムの順序が保持される', () => {
            mediaGalleryStore.addItem(makeItem('img-1', false));
            mediaGalleryStore.addItem(makeItem('ph-1', true));
            mediaGalleryStore.addItem(makeItem('img-2', false));
            mediaGalleryStore.addItem(makeItem('ph-2', true));
            mediaGalleryStore.addItem(makeItem('img-3', false));

            mediaGalleryStore.removePlaceholders();

            expect(mediaGalleryStore.items.map(i => i.id)).toEqual(['img-1', 'img-2', 'img-3']);
        });
    });
});
