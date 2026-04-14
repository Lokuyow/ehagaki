import { describe, expect, it, vi } from 'vitest';

import {
    collectFullscreenMediaItems,
    createPostStatusHandlers,
    getFullscreenMediaItemAt,
    moveEditorMediaToGallery,
    moveGalleryMediaToEditor,
    submitPendingPostWithSecretKey,
} from '../../lib/postComponentUtils';

describe('createPostStatusHandlers', () => {
    it('送信開始・成功・失敗の状態を一貫して更新する', () => {
        const updatePostStatus = vi.fn();
        const clearContentAfterSuccess = vi.fn();
        const onPostSuccess = vi.fn();
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
    });
});

describe('submitPendingPostWithSecretKey', () => {
    it('成功時は start の後に success を呼ぶ', async () => {
        const postManager = {
            prepareImageBlurhashMap: vi.fn(() => ({ image: { blurhash: 'hash' } })),
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
            image: { blurhash: 'hash' },
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
                { id: '1', type: 'image', src: 'https://example.com/a.jpg', isPlaceholder: false, alt: 'a' },
                { id: '2', type: 'video', src: 'https://example.com/b.mp4', isPlaceholder: true },
            ],
            currentEditor: null,
        })).toEqual([
            { src: 'https://example.com/a.jpg', alt: 'a', type: 'image' },
        ]);
    });

    it('フリー配置モードでは editor ノードから収集する', () => {
        const currentEditor = {
            state: {
                doc: {
                    descendants: (callback: (node: any) => void) => {
                        callback({
                            type: { name: 'image' },
                            attrs: { src: 'https://example.com/a.jpg', alt: 'a', isPlaceholder: false },
                        });
                        callback({
                            type: { name: 'video' },
                            attrs: { src: 'https://example.com/b.mp4', isPlaceholder: false },
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
            galleryItems: [],
            currentEditor,
        })).toEqual([
            { src: 'https://example.com/a.jpg', alt: 'a', type: 'image' },
            { src: 'https://example.com/b.mp4', alt: undefined, type: 'video' },
        ]);
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
            alt: 'a',
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
            alt: undefined,
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
                    alt: 'a',
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
        });
        expect(insertMock).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledOnce();
    });
});