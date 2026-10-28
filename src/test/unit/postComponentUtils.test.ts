import { describe, expect, it, vi } from 'vitest';

import {
    collectFullscreenMediaItems,
    createPostStatusHandlers,
    findFullscreenMediaIndex,
    getFullscreenMediaItemAt,
    moveEditorMediaToGallery,
    moveGalleryMediaToEditor,
    submitPendingPostWithSecretKey,
} from '../../lib/postComponentUtils';

describe('createPostStatusHandlers', () => {
    it('late delivery settlement never repeats ordinary success status or side effects', async () => {
        const updatePostStatus = vi.fn(), clearContentAfterSuccess = vi.fn(), onPostSuccess = vi.fn();
        const handlers = createPostStatusHandlers({ updatePostStatus, clearContentAfterSuccess, onPostSuccess });
        let resolve!: (result: import('../../lib/types').PostResult) => void;
        const deliverySettled = new Promise<import('../../lib/types').PostResult>(done => { resolve = done; });
        handlers.markSuccess({ success: true, deliveryPending: true, deliverySettled });
        resolve({ success: true, fullyDelivered: false });
        await Promise.resolve();
        expect(updatePostStatus).toHaveBeenCalledOnce();
        expect(updatePostStatus.mock.calls.at(-1)?.[0].message).toBe('postComponent.post_success');
        expect(clearContentAfterSuccess).toHaveBeenCalledOnce();
        expect(onPostSuccess).toHaveBeenCalledOnce();

        let finish!: (result: import('../../lib/types').PostResult) => void;
        handlers.markSuccess({ success: true, deliveryPending: true,
            deliverySettled: new Promise(done => { finish = done; }) });
        handlers.markSending();
        const calls = updatePostStatus.mock.calls.length;
        finish({ success: true, fullyDelivered: false });
        await Promise.resolve();
        expect(updatePostStatus).toHaveBeenCalledTimes(calls);
    });
    it('送信開始・成功・失敗の状態を一貫して更新する', () => {
        const events: string[] = [];
        const updatePostStatus = vi.fn(() => events.push('status'));
        const clearContentAfterSuccess = vi.fn(() => events.push('clear'));
        const onPostSuccess = vi.fn(() => events.push('callback'));
        const handlers = createPostStatusHandlers({
            updatePostStatus,
            clearContentAfterSuccess,
            onPostSuccess,
        });

        handlers.markSending();
        handlers.markSuccess();
        handlers.markFailure('custom-error');
        handlers.markFailure();

        expect(updatePostStatus).toHaveBeenNthCalledWith(1, {
            sending: true,
            success: false,
            error: false,
            message: '',
            completed: false,
        });
        expect(updatePostStatus).toHaveBeenNthCalledWith(2, {
            sending: false,
            success: true,
            error: false,
            message: 'postComponent.post_success',
            completed: true,
        });
        expect(updatePostStatus).toHaveBeenNthCalledWith(3, {
            sending: false,
            success: false,
            error: true,
            message: 'custom-error',
            completed: false,
        });
        expect(updatePostStatus).toHaveBeenNthCalledWith(4, {
            sending: false,
            success: false,
            error: true,
            message: 'postComponent.post_error',
            completed: false,
        });
        expect(clearContentAfterSuccess).toHaveBeenCalledOnce();
        expect(onPostSuccess).toHaveBeenCalledOnce();
        expect(events.slice(0, 4)).toEqual(['status', 'status', 'clear', 'callback']);
    });

    it('個別relay拒否があっても通常の成功表示を維持する', () => {
        const updatePostStatus = vi.fn();
        const handlers = createPostStatusHandlers({
            updatePostStatus,
            clearContentAfterSuccess: vi.fn(),
        });

        handlers.markSuccess({
            success: true,
            fullyDelivered: true,
            acceptedRelays: ['wss://read-a.example/'],
            rejectedRelays: [{
                relay: 'wss://read-b.example/',
                category: 'restricted',
            }],
            delivery: {
                authorWrite: {
                    status: 'delivered',
                    requestedRelays: ['wss://author.example/'],
                    acceptedRelays: ['wss://author.example/'],
                    rejectedRelays: [],
                    timedOutRelays: [],
                    authRequiredRelays: [],
                    unconfirmedRelays: [],
                },
                taggedUserRead: {
                    recipient: {
                        status: 'partial',
                        requestedRelays: [
                            'wss://read-a.example/',
                            'wss://read-b.example/',
                        ],
                        acceptedRelays: ['wss://read-a.example/'],
                        rejectedRelays: [{
                            relay: 'wss://read-b.example/',
                            category: 'restricted',
                        }],
                        timedOutRelays: [],
                        authRequiredRelays: [],
                        unconfirmedRelays: [],
                    },
                },
                additional: [],
            },
        });

        expect(updatePostStatus).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            message: 'postComponent.post_success',
        }));
    });

    it('前のsessionで投稿済みならsuccess statusだけを更新して現在のcomposerを保持する', () => {
        const updatePostStatus = vi.fn();
        const clearContentAfterSuccess = vi.fn();
        const onPostSuccess = vi.fn();
        const handlers = createPostStatusHandlers({
            updatePostStatus,
            clearContentAfterSuccess,
            onPostSuccess,
        });

        handlers.markSuccess({ success: true, preserveComposerContent: true });

        expect(updatePostStatus).toHaveBeenCalledOnce();
        expect(clearContentAfterSuccess).not.toHaveBeenCalled();
        expect(onPostSuccess).not.toHaveBeenCalled();
    });
});

describe('submitPendingPostWithSecretKey', () => {
    it('成功時は start の後に success を呼ぶ', async () => {
        const postManager = {
            prepareImageBlurhashMap: vi.fn(() => ({ image: { m: 'image/png', blurhash: 'hash' } })),
            submitPost: vi.fn(async () => ({ success: true })),
        };
        const currentEditor = { id: 'editor' } as any;
        const onStart = vi.fn();
        const onSuccess = vi.fn();
        const onFailure = vi.fn();

        await submitPendingPostWithSecretKey({
            postManager,
            currentEditor,
            imageOxMap: { image: 'ox' },
            imageXMap: { image: 'x' },
            pendingPost: 'pending',
            onStart,
            onSuccess,
            onFailure,
        });

        expect(postManager.prepareImageBlurhashMap).toHaveBeenCalledWith(
            currentEditor,
            { image: 'ox' },
            { image: 'x' },
        );
        expect(postManager.submitPost).toHaveBeenCalledWith('pending', {
            image: { m: 'image/png', blurhash: 'hash' },
        });
        expect(onStart).toHaveBeenCalledOnce();
        expect(onSuccess).toHaveBeenCalledOnce();
        expect(onFailure).not.toHaveBeenCalled();
    });

    it('失敗結果や例外では failure を呼ぶ', async () => {
        const commonParams = {
            currentEditor: { id: 'editor' } as any,
            imageOxMap: {},
            imageXMap: {},
            pendingPost: 'pending',
            onStart: vi.fn(),
            onSuccess: vi.fn(),
        };

        const failedResult = vi.fn();
        await submitPendingPostWithSecretKey({
            ...commonParams,
            postManager: {
                prepareImageBlurhashMap: vi.fn(() => ({})),
                submitPost: vi.fn(async () => ({ success: false, error: 'result-error' })),
            },
            onFailure: failedResult,
        });

        expect(failedResult).toHaveBeenCalledWith('result-error');

        const thrownFailure = vi.fn();
        await submitPendingPostWithSecretKey({
            ...commonParams,
            postManager: {
                prepareImageBlurhashMap: vi.fn(() => ({})),
                submitPost: vi.fn(async () => {
                    throw new Error('boom');
                }),
            },
            onFailure: thrownFailure,
        });

        expect(thrownFailure).toHaveBeenCalledWith();
    });
});

describe('collectFullscreenMediaItems', () => {
    it('ギャラリーモードではプレースホルダーを除外して返す', () => {
        expect(collectFullscreenMediaItems({
            mediaFreePlacement: false,
            galleryItems: [
                { id: '1', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false, alt: 'a', dim: '800x600' },
                { id: '2', type: 'video', src: 'https://example.com/b.mp4', isPlaceholder: true },
            ],
            currentEditor: null,
        })).toEqual([
            {
                id: '1',
                src: 'https://example.com/a.jpg',
                alt: 'a',
                type: 'image',
                dim: '800x600',
                width: 800,
                height: 600,
            },
        ]);
    });

    it('フリー配置モードでは editor ノードから収集する', () => {
        const currentEditor = {
            state: {
                doc: {
                    descendants: (callback: (node: any) => void) => {
                        callback({
                            type: { name: 'image' },
                            attrs: {
                                id: 'img-1',
                                src: 'https://example.com/a.jpg',
                                alt: 'a',
                                dim: '640x480',
                                isPlaceholder: false,
                            },
                        });
                        callback({
                            type: { name: 'video' },
                            attrs: {
                                id: 'video-1',
                                src: 'https://example.com/b.mp4',
                                isPlaceholder: false,
                            },
                        });
                        callback({
                            type: { name: 'image' },
                            attrs: { src: 'placeholder', isPlaceholder: true },
                        });
                    },
                },
            },
        } as any;

        expect(collectFullscreenMediaItems({
            mediaFreePlacement: true,
            galleryItems: [{ id: 'hidden-gallery', src: 'https://example.com/hidden.jpg', type: 'image', isPlaceholder: false }],
            currentEditor,
        })).toEqual([
            {
                id: 'img-1',
                src: 'https://example.com/a.jpg',
                alt: 'a',
                type: 'image',
                dim: '640x480',
                width: 640,
                height: 480,
            },
            {
                id: 'video-1',
                src: 'https://example.com/b.mp4',
                alt: undefined,
                type: 'video',
                dim: undefined,
                width: undefined,
                height: undefined,
            },
        ]);
    });

    it('free placement with temporary Gallery retains inline image/video and each item identity', () => {
        const currentEditor = { state: { doc: { descendants: (callback: (node: any) => void) => {
            callback({ type: { name: 'image' }, attrs: { id: 'inline-image', src: 'https://example.com/inline.png', dim: '640x480' } });
            callback({ type: { name: 'video' }, attrs: { id: 'inline-video', src: 'https://example.com/inline.mp4', dim: '320x240' } });
            callback({ type: { name: 'image' }, attrs: { id: 'inline-placeholder', src: 'placeholder', isPlaceholder: true } });
        } } } } as any;
        const galleryItems = [
            { id: 'reaction-image', src: 'https://example.com/reaction.png', type: 'image' as const, isPlaceholder: false, dim: '128x128' },
            { id: 'gallery-placeholder', src: 'placeholder', type: 'image' as const, isPlaceholder: true },
        ];
        const items = collectFullscreenMediaItems({ mediaFreePlacement: true, includeTemporaryGallery: true, currentEditor, galleryItems });
        expect(items.map(({ id, src, type }) => ({ id, src, type }))).toEqual([
            { id: 'inline-image', src: 'https://example.com/inline.png', type: 'image' },
            { id: 'inline-video', src: 'https://example.com/inline.mp4', type: 'video' },
            { id: 'reaction-image', src: 'https://example.com/reaction.png', type: 'image' },
        ]);
        expect(findFullscreenMediaIndex(items, 'inline-image', galleryItems[0].src)).toBe(0);
        expect(findFullscreenMediaIndex(items, 'reaction-image', items[0].src)).toBe(2);
        expect(getFullscreenMediaItemAt(items, 1)?.id).toBe('inline-video');
        expect(getFullscreenMediaItemAt(items, 2)).toMatchObject({ width: 128, height: 128 });
        expect(collectFullscreenMediaItems({ mediaFreePlacement: false, includeTemporaryGallery: true, currentEditor, galleryItems })
            .map(item => item.id)).toEqual(['reaction-image']);
    });
});

describe('findFullscreenMediaIndex', () => {
    it('mediaId を優先し、見つからない場合は src にフォールバックする', () => {
        const items = [
            { id: 'media-1', src: 'https://example.com/a.jpg', type: 'image' as const },
            { id: 'media-2', src: 'https://example.com/a.jpg', type: 'image' as const },
            { id: 'media-3', src: 'https://example.com/b.mp4', type: 'video' as const },
        ];

        expect(findFullscreenMediaIndex(items, 'media-2', 'https://example.com/a.jpg')).toBe(1);
        expect(findFullscreenMediaIndex(items, 'missing', 'https://example.com/b.mp4')).toBe(2);
        expect(findFullscreenMediaIndex(items, '', '')).toBe(-1);
    });
});

describe('getFullscreenMediaItemAt', () => {
    it('指定 index の item を返し、範囲外は undefined を返す', () => {
        const items = [
            { src: 'a', type: 'image' as const },
            { src: 'b', type: 'video' as const },
        ];

        expect(getFullscreenMediaItemAt(items, 1)).toEqual(items[1]);
        expect(getFullscreenMediaItemAt(items, 3)).toBeUndefined();
    });
});

describe('moveEditorMediaToGallery', () => {
    it('editor の非プレースホルダーメディアを gallery item に変換して削除する', () => {
        const addGalleryItem = vi.fn();
        const deleteMock = vi.fn().mockReturnThis();
        const dispatch = vi.fn();
        const currentEditor = {
            state: {
                doc: {
                    descendants: (callback: (node: any, pos: number) => void) => {
                        callback({
                            type: { name: 'image' },
                            attrs: {
                                src: 'https://example.com/a.jpg',
                                blurhash: 'blurhash-a',
                                dim: '100x100',
                                alt: 'a',
                                isPlaceholder: false,
                            },
                            nodeSize: 1,
                        }, 2);
                        callback({
                            type: { name: 'video' },
                            attrs: {
                                src: 'https://example.com/b.mp4',
                                isPlaceholder: false,
                            },
                            nodeSize: 1,
                        }, 4);
                    },
                },
                tr: {
                    delete: deleteMock,
                },
            },
            view: {
                dispatch,
            },
        } as any;

        const moved = moveEditorMediaToGallery({
            currentEditor,
            imageOxMap: { 'https://example.com/a.jpg': 'ox-a' },
            imageXMap: { 'https://example.com/a.jpg': 'x-a' },
            addGalleryItem,
            createMediaItemId: vi.fn()
                .mockReturnValueOnce('item-1')
                .mockReturnValueOnce('item-2'),
        });

        expect(moved).toBe(true);
        expect(addGalleryItem).toHaveBeenNthCalledWith(1, {
            id: 'item-1',
            type: 'image',
            src: 'https://example.com/a.jpg',
            isPlaceholder: false,
            blurhash: 'blurhash-a',
            ox: 'ox-a',
            x: 'x-a',
            dim: '100x100',
            size: undefined,
            alt: 'a',
            uploadProtocol: undefined,
        });
        expect(addGalleryItem).toHaveBeenNthCalledWith(2, {
            id: 'item-2',
            type: 'video',
            src: 'https://example.com/b.mp4',
            isPlaceholder: false,
            blurhash: undefined,
            ox: undefined,
            x: undefined,
            dim: undefined,
            size: undefined,
            alt: undefined,
            uploadProtocol: undefined,
        });
        expect(deleteMock).toHaveBeenNthCalledWith(1, 4, 5);
        expect(deleteMock).toHaveBeenNthCalledWith(2, 2, 3);
        expect(dispatch).toHaveBeenCalledOnce();
    });
});

describe('moveGalleryMediaToEditor', () => {
    it('gallery items を editor node に変換し ox/x map を返す', () => {
        const insertMock = vi.fn().mockReturnThis();
        const dispatch = vi.fn();
        const currentEditor = {
            state: {
                doc: {
                    content: { size: 10 },
                    eq: () => false,
                },
                tr: {
                    insert: insertMock,
                },
                schema: {
                    nodes: {
                        image: {
                            create: vi.fn((attrs) => ({ ...attrs, nodeSize: 1 })),
                        },
                        video: {
                            create: vi.fn((attrs) => ({ ...attrs, nodeSize: 1 })),
                        },
                    },
                },
            },
            view: {
                dispatch,
            },
        } as any;

        const result = moveGalleryMediaToEditor({
            currentEditor,
            items: [
                {
                    id: 'item-1',
                    type: 'image',
                    src: 'https://example.com/a.jpg',
                    isPlaceholder: false,
                    blurhash: 'blurhash-a',
                    ox: 'ox-a',
                    x: 'x-a',
                    dim: '100x100',
                    size: 1234,
                    alt: 'a',
                    uploadProtocol: 'blossom',
                },
                {
                    id: 'item-2',
                    type: 'video',
                    src: 'https://example.com/b.mp4',
                    isPlaceholder: false,
                },
                {
                    id: 'item-3',
                    type: 'image',
                    src: 'placeholder',
                    isPlaceholder: true,
                },
            ],
        });

        expect(result).toEqual({
            imageOxMap: { 'https://example.com/a.jpg': 'ox-a' },
            imageXMap: { 'https://example.com/a.jpg': 'x-a' },
            hadItems: true,
            movedItemIds: ['item-1', 'item-2'],
        });
        expect(insertMock).toHaveBeenCalledTimes(2);
        expect((currentEditor.state.schema.nodes.image.create as any).mock.calls[0][0]).toEqual(expect.objectContaining({
            size: 1234,
            uploadProtocol: 'blossom',
        }));
        expect(dispatch).toHaveBeenCalledOnce();
    });
});
