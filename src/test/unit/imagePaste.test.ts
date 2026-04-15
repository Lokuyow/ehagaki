import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    mockAddGalleryItem,
    mockGenerateMediaItemId,
} = vi.hoisted(() => ({
    mockAddGalleryItem: vi.fn(),
    mockGenerateMediaItemId: vi.fn(),
}));

vi.mock('../../stores/uploadStore.svelte', async () => {
    const { createUploadStoreLocalMock } = await import('../mocks/storeModules');
    return createUploadStoreLocalMock();
});

vi.mock('../../stores/mediaGalleryStore.svelte', () => ({
    mediaGalleryStore: {
        addItem: mockAddGalleryItem,
    },
}));

vi.mock('../../lib/utils/appUtils', () => ({
    generateMediaItemId: mockGenerateMediaItemId,
}));

import { mediaFreePlacementStore } from '../../stores/uploadStore.svelte';
import { MediaPasteExtension } from '../../lib/editor/mediaPaste';

function setMediaFreePlacement(value: boolean) {
    (mediaFreePlacementStore as any).value = value;
}

function getMediaPasteProps() {
    const extension = MediaPasteExtension as any;
    const plugins = extension.addProseMirrorPlugins?.call(extension)
        ?? extension.config.addProseMirrorPlugins?.call(extension);

    expect(plugins).toHaveLength(1);
    return plugins[0].props;
}

function createSchema() {
    return {
        nodes: {
            image: {
                create: (attrs: Record<string, unknown>) => ({ type: 'image', attrs, nodeSize: 1 }),
            },
            video: {
                create: (attrs: Record<string, unknown>) => ({ type: 'video', attrs, nodeSize: 1 }),
            },
        },
    };
}

function createTransaction(doc: any) {
    const transaction = {
        doc,
        replaceWith: vi.fn(() => transaction),
        insert: vi.fn(() => transaction),
        delete: vi.fn(() => transaction),
    };

    return transaction;
}

function createViewState() {
    const paragraph = {
        type: { name: 'paragraph' },
        textContent: '',
        descendants: vi.fn(),
    };
    const doc = {
        childCount: 1,
        firstChild: paragraph,
        resolve: vi.fn(() => ({
            parent: paragraph,
            depth: 1,
            start: vi.fn(() => 5),
            end: vi.fn(() => 7),
        })),
        descendants: vi.fn((callback: (node: unknown, pos: number) => void) => {
            callback(paragraph, 0);
        }),
    };
    const tr = createTransaction(doc);

    return {
        state: {
            tr,
            selection: { from: 5 },
            schema: createSchema(),
            doc,
        },
        tr,
    };
}

function createPasteEvent(text: string): ClipboardEvent {
    return {
        clipboardData: {
            getData: vi.fn((type: string) => (type === 'text/plain' ? text : '')),
        },
        preventDefault: vi.fn(),
    } as unknown as ClipboardEvent;
}

describe('MediaPasteExtension', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setMediaFreePlacement(true);
        mockGenerateMediaItemId
            .mockReset()
            .mockReturnValueOnce('media-1')
            .mockReturnValueOnce('media-2');
    });

    it('paste と text input のハンドラーを提供する', () => {
        const props = getMediaPasteProps();

        expect(MediaPasteExtension.name).toBe('mediaPaste');
        expect(typeof props.handlePaste).toBe('function');
        expect(typeof props.handleTextInput).toBe('function');
    });

    it('メディア URL が含まれない paste は処理しない', () => {
        const props = getMediaPasteProps();
        const { state } = createViewState();
        const dispatch = vi.fn();
        const event = createPasteEvent('plain text only');

        const handled = props.handlePaste({ state, dispatch }, event);

        expect(handled).toBe(false);
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('ギャラリーモードの paste はメディアを gallery に追加する', () => {
        const props = getMediaPasteProps();
        const { state } = createViewState();
        const dispatch = vi.fn();
        const event = createPasteEvent('https://example.com/image.jpg\nhttps://example.com/video.mp4');
        setMediaFreePlacement(false);

        const handled = props.handlePaste({ state, dispatch }, event);

        expect(handled).toBe(true);
        expect(event.preventDefault).toHaveBeenCalledOnce();
        expect(mockAddGalleryItem).toHaveBeenNthCalledWith(1, {
            id: 'media-1',
            type: 'image',
            src: 'https://example.com/image.jpg',
            isPlaceholder: false,
        });
        expect(mockAddGalleryItem).toHaveBeenNthCalledWith(2, {
            id: 'media-2',
            type: 'video',
            src: 'https://example.com/video.mp4',
            isPlaceholder: false,
        });
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('フリーモードの paste は空パラグラフを置換して残りのメディアを挿入する', () => {
        const props = getMediaPasteProps();
        const { state, tr } = createViewState();
        const dispatch = vi.fn();
        const event = createPasteEvent('https://example.com/image.jpg\nhttps://example.com/video.mp4');

        const handled = props.handlePaste({ state, dispatch }, event);

        expect(handled).toBe(true);
        expect(event.preventDefault).toHaveBeenCalledOnce();
        expect(tr.replaceWith).toHaveBeenCalledWith(
            5,
            7,
            expect.objectContaining({
                attrs: {
                    src: 'https://example.com/image.jpg',
                    alt: 'Pasted image',
                },
            }),
        );
        expect(tr.insert).toHaveBeenCalledWith(
            6,
            expect.objectContaining({
                attrs: expect.objectContaining({
                    src: 'https://example.com/video.mp4',
                    id: expect.stringMatching(/^pasted-video-\d+-1$/),
                }),
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(tr);
    });

    it('ギャラリーモードの text input は gallery へ追加して元テキストを削除する', () => {
        const props = getMediaPasteProps();
        const { state, tr } = createViewState();
        const dispatch = vi.fn();
        setMediaFreePlacement(false);

        const handled = props.handleTextInput(
            { state, dispatch },
            3,
            12,
            'https://example.com/image.jpg\nhttps://example.com/video.mp4',
        );

        expect(handled).toBe(true);
        expect(mockAddGalleryItem).toHaveBeenCalledTimes(2);
        expect(tr.delete).toHaveBeenCalledWith(3, 12);
        expect(dispatch).toHaveBeenCalledWith(tr);
    });

    it('フリーモードの text input はメディアノードを挿入する', () => {
        const props = getMediaPasteProps();
        const { state, tr } = createViewState();
        const dispatch = vi.fn();

        const handled = props.handleTextInput(
            { state, dispatch },
            2,
            20,
            'https://example.com/image.jpg\nhttps://example.com/video.mp4',
        );

        expect(handled).toBe(true);
        expect(tr.delete).toHaveBeenCalledWith(2, 20);
        expect(tr.insert).toHaveBeenNthCalledWith(
            1,
            2,
            expect.objectContaining({
                attrs: {
                    src: 'https://example.com/image.jpg',
                    alt: 'Pasted image',
                },
            }),
        );
        expect(tr.insert).toHaveBeenNthCalledWith(
            2,
            3,
            expect.objectContaining({
                attrs: expect.objectContaining({
                    src: 'https://example.com/video.mp4',
                    id: expect.stringMatching(/^pasted-video-\d+-1$/),
                }),
            }),
        );
        expect(dispatch).toHaveBeenCalledWith(tr);
    });
});
