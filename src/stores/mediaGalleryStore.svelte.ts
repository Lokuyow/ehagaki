// メディアギャラリーストア（メディア下部固定モード用）
import type { MediaGalleryItem } from '../lib/types';

let mediaGalleryItems = $state<MediaGalleryItem[]>([]);

export const mediaGalleryStore = {
    get items() { return mediaGalleryItems; },

    addItem: (item: MediaGalleryItem) => {
        mediaGalleryItems = [...mediaGalleryItems, item];
    },

    removeItem: (id: string) => {
        mediaGalleryItems = mediaGalleryItems.filter(item => item.id !== id);
    },

    updateItem: (id: string, partial: Partial<MediaGalleryItem>) => {
        mediaGalleryItems = mediaGalleryItems.map(item =>
            item.id === id ? { ...item, ...partial } : item
        );
    },

    reorderItems: (fromIndex: number, toIndex: number) => {
        const items = [...mediaGalleryItems];
        const [moved] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, moved);
        mediaGalleryItems = items;
    },

    clearAll: () => {
        mediaGalleryItems = [];
    },

    getItems: () => [...mediaGalleryItems],

    /** アップロード済みメディアの URL 一覧を返す（プレースホルダー除外） */
    getContentUrls: () => {
        return mediaGalleryItems
            .filter(item => !item.isPlaceholder && item.src)
            .map(item => item.src);
    },

    /** 投稿用の imeta メタデータマップを返す（画像のみ） */
    getImageBlurhashMap: (): Record<string, { m: string; blurhash?: string; ox?: string; x?: string; dim?: string; alt?: string }> => {
        const result: Record<string, { m: string; blurhash?: string; ox?: string; x?: string; dim?: string; alt?: string }> = {};
        for (const item of mediaGalleryItems) {
            if (!item.isPlaceholder && item.src && item.type === 'image') {
                result[item.src] = {
                    m: item.mimeType || 'image/jpeg',
                    blurhash: item.blurhash,
                    ox: item.ox,
                    x: item.x,
                    dim: item.dim,
                    alt: item.alt,
                };
            }
        }
        return result;
    },

    hasItems: () => mediaGalleryItems.length > 0,

    hasNonPlaceholderItems: () => mediaGalleryItems.some(item => !item.isPlaceholder),
};
