import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import type { MediaGalleryItem } from '../../lib/types';
import MediaGalleryItemComponent from '../../components/MediaGalleryItem.svelte';

const { showImageFullscreen } = vi.hoisted(() => ({
    showImageFullscreen: vi.fn(),
}));

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'imageNode.uploading': '画像アップロード中',
        'videoNode.uploading': '動画アップロード中',
        'imageContextMenu.delete': '削除',
        'imageContextMenu.copyUrl': 'URLをコピー',
        'imageContextMenu.copySuccess': 'コピーしました',
        'videoContextMenu.delete': '削除',
        'videoContextMenu.copyUrl': 'URLをコピー',
        'videoContextMenu.copySuccess': 'コピーしました',
    };

    return translations[key] || key;
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

vi.mock('../../stores/postUIStore.svelte', () => ({
    postComponentUIStore: {
        showImageFullscreen,
    },
}));

function createImageItem(overrides: Partial<MediaGalleryItem> = {}): MediaGalleryItem {
    return {
        id: 'image-1',
        type: 'image',
        src: 'https://example.com/image.png',
        isPlaceholder: false,
        alt: 'gallery image',
        ...overrides,
    };
}

describe('MediaGalleryItem', () => {
    beforeEach(() => {
        showImageFullscreen.mockClear();
    });

    it('opens fullscreen when Enter is pressed on an interactive image', async () => {
        render(MediaGalleryItemComponent, {
            props: {
                item: createImageItem(),
                index: 0,
                onDelete: vi.fn(),
                onDragStart: vi.fn(),
                onDragOver: vi.fn(),
                onDragEnd: vi.fn(),
                onDrop: vi.fn(),
            },
        });

        const target = screen.getByRole('button', { name: 'gallery image' });
        await fireEvent.keyDown(target, { key: 'Enter' });

        expect(showImageFullscreen).toHaveBeenCalledWith(
            'https://example.com/image.png',
            'gallery image',
            'image-1',
        );
    });

    it('opens fullscreen when Space is pressed on an interactive image', async () => {
        render(MediaGalleryItemComponent, {
            props: {
                item: createImageItem(),
                index: 0,
                onDelete: vi.fn(),
                onDragStart: vi.fn(),
                onDragOver: vi.fn(),
                onDragEnd: vi.fn(),
                onDrop: vi.fn(),
            },
        });

        const target = screen.getByRole('button', { name: 'gallery image' });
        await fireEvent.keyDown(target, { key: ' ' });

        expect(showImageFullscreen).toHaveBeenCalledWith(
            'https://example.com/image.png',
            'gallery image',
            'image-1',
        );
    });

    it('prevents default behavior when Space is pressed', async () => {
        render(MediaGalleryItemComponent, {
            props: {
                item: createImageItem(),
                index: 0,
                onDelete: vi.fn(),
                onDragStart: vi.fn(),
                onDragOver: vi.fn(),
                onDragEnd: vi.fn(),
                onDrop: vi.fn(),
            },
        });

        const target = screen.getByRole('button', { name: 'gallery image' });
        const dispatched = await fireEvent.keyDown(target, { key: ' ' });

        expect(dispatched).toBe(false);
        expect(showImageFullscreen).toHaveBeenCalledTimes(1);
    });

    it('does not open fullscreen for a placeholder image', async () => {
        render(MediaGalleryItemComponent, {
            props: {
                item: createImageItem({ isPlaceholder: true }),
                index: 0,
                onDelete: vi.fn(),
                onDragStart: vi.fn(),
                onDragOver: vi.fn(),
                onDragEnd: vi.fn(),
                onDrop: vi.fn(),
            },
        });

        const target = screen.queryByRole('button', { name: 'gallery image' });

        expect(target).toBeNull();

        const { container } = render(MediaGalleryItemComponent, {
            props: {
                item: createImageItem({ isPlaceholder: true }),
                index: 0,
                onDelete: vi.fn(),
                onDragStart: vi.fn(),
                onDragOver: vi.fn(),
                onDragEnd: vi.fn(),
                onDrop: vi.fn(),
            },
        });
        const media = container.querySelector('.gallery-item-media');

        expect(media).not.toBeNull();
        await fireEvent.keyDown(media!, { key: 'Enter' });

        expect(showImageFullscreen).not.toHaveBeenCalled();
    });
});
